# Hướng dẫn Toàn diện: Cấu hình Metrics Server và HPA trên Kubernetes

Tài liệu này hướng dẫn cách kết hợp cả 2 mẫu cấu hình đã soạn thảo: **Metrics Server** và **HorizontalPodAutoscaler (HPA)** để thiết lập cơ chế tự động co giãn tải hoàn chỉnh cho cụm Kubernetes của bạn.

---

## 1. Cài đặt Metrics Server

Việc cài đặt phải được thực hiện trên **máy chủ Control Plane (Master Node) gốc** mà bạn đã setup ban đầu, nơi có quyền truy cập `kubectl` và công cụ quản lý gói `Helm`.

### Bước 1.1: Sử dụng Script cài đặt nhanh
Chúng tôi đã chuẩn bị sẵn một script tự động hóa toàn bộ quá trình tải và cài đặt:
- Đường dẫn script: [install-metrics-server.sh.example](file:///d:/Code/Deploy/templates/shared/metrics-server/install-metrics-server.sh.example)

Thực hiện lệnh sau trên Control Plane:
```bash
# Di chuyển tới thư mục chứa template
cd templates/shared/metrics-server/

# Sao chép và chạy script cài đặt
cp install-metrics-server.sh.example install-metrics-server.sh
chmod +x install-metrics-server.sh
./install-metrics-server.sh
```

> [!NOTE]
> Chi tiết các bước cài đặt thủ công từng bước bằng lệnh Helm được mô tả chi tiết tại [Metrics Server README](file:///d:/Code/Deploy/templates/shared/metrics-server/README.md).

---

## 2. Sửa lỗi kết nối qua Giao diện Rancher (Fix lỗi)

Trong một số môi trường Kubernetes, đặc biệt là các cụm tự cài đặt hoặc chạy qua Rancher, Metrics Server có thể không khởi chạy được hoặc không scrape được dữ liệu do lỗi chứng chỉ TLS của Kubelet hoặc cấu hình cổng (port). Bạn có thể cấu hình nhanh chóng qua giao diện Rancher như sau:

### Các bước thực hiện trên Rancher UI:
1. **Chọn Namespace**: Chọn namespace **`kube-system`** từ menu thả xuống trên giao diện quản trị Rancher.
2. **Tìm Deployment**: Tìm và chọn Deployment có tên **`metrics-server`** (hoặc `metrics-server` trong nhóm `Workloads`).
3. **Chỉnh sửa cấu hình**: Nhấp vào nút tùy chọn và chọn **`Edit YAML`**.
4. **Thay đổi cổng kết nối (Port)**:
   - Tìm tất cả các trường port trong file YAML (như `containerPort`, `targetPort`, `secure-port`) và sửa đổi giá trị thành **`4443`**.
5. **Cấu hình tham số bỏ qua TLS**:
   - Cuộn xuống phần tham số khởi chạy của container (`args`).
   - Thêm cấu hình sau vào danh sách tham số (dưới container chính):
     ```yaml
     args:
       - --kubelet-insecure-tls=true
     ```
6. **Lưu cấu hình**: Nhấp **`Save`** để áp dụng. Rancher sẽ tự động rolling-update lại Pod mới cho Metrics Server với cấu hình đã chỉnh sửa.

---

## 3. Kiểm tra hoạt động của hệ thống

Sau khi deploy/sửa đổi cấu hình từ 1-2 phút (để Metrics Server hoàn thành chu kỳ thu thập thông tin đầu tiên), chạy các lệnh sau để kiểm tra:

### Kiểm tra tài nguyên tiêu thụ trên Node:
```bash
kubectl top nodes
```
*Kết quả hiển thị đúng CPU (cores, %) và RAM (bytes, %) của từng Node.*

### Kiểm tra tài nguyên tiêu thụ của Pod:
```bash
kubectl top pod -n <namespace-cua-ban>
```
*Thay thế `<namespace-cua-ban>` bằng namespace thực tế của ứng dụng.*

---

## 4. Hoàn thiện File YAML cấu hình HPA

Khi Metrics Server đã hoạt động ổn định và trả về chỉ số CPU/Memory chính xác, bạn tiến hành triển khai HPA để tự động điều chỉnh số lượng Pod.

### Bước 4.1: Sử dụng File cấu hình HPA mẫu
- Đường dẫn file mẫu: [hpa.yml.example](file:///d:/Code/Deploy/templates/kubernetes/hpa/hpa.yml.example)

Sao chép và đổi tên file cấu hình:
```bash
cd templates/kubernetes/hpa/
cp hpa.yml.example hpa.yml
```

### Bước 4.2: Tùy chỉnh tham số HPA (`hpa.yml`)
Mở file `hpa.yml` và thay thế các placeholder sau bằng thông số thực tế của bạn:
- `<APP_NAME>`: Tên ứng dụng của bạn (ví dụ: `my-web-app`).
- `<NAMESPACE>`: Namespace ứng dụng đang chạy.
- `<MIN_REPLICAS>`: Số lượng Pod tối thiểu chạy thường trực (ví dụ: `2`).
- `<MAX_REPLICAS>`: Số lượng Pod tối đa khi quá tải (ví dụ: `10`).
- `<CPU_TARGET_PERCENT>`: Ngưỡng sử dụng CPU kích hoạt scale-up (ví dụ: `80`).
- `<MEMORY_TARGET_PERCENT>`: Ngưỡng sử dụng Memory kích hoạt scale-up (ví dụ: `80`).

### Bước 4.3: Deploy HPA
```bash
kubectl apply -f hpa.yml
```

> [!IMPORTANT]
> - Hãy chắc chắn rằng các Pod của bạn đã được cấu hình phần `resources.requests` trong Deployment, nếu không HPA sẽ báo trạng thái `<unknown>` và không hoạt động.
> - Tham khảo thêm cách kiểm tra và quản lý HPA nâng cao tại [HPA README](file:///d:/Code/Deploy/templates/kubernetes/hpa/README.md).
