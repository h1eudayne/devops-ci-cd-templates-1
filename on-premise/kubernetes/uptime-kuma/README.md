# Hướng dẫn Triển khai Uptime Kuma bằng Helm trên Kubernetes

Tài liệu này hướng dẫn chi tiết các bước cấu hình, triển khai và sửa lỗi phân giải tên miền đối với **Uptime Kuma** (công cụ giám sát trạng thái dịch vụ self-hosted) sử dụng Helm Chart kết hợp với hệ thống lưu trữ **NFS Storage (PV & PVC)** và **Ingress** trong namespace `monitoring`.

---

## Các bước thiết lập Uptime Kuma

Dưới đây là quy trình 4 bước chuẩn để đưa Uptime Kuma vào vận hành thực tế.

---

### BƯỚC 1: Tạo PV và PVC Uptime Kuma

PersistentVolume (PV) và PersistentVolumeClaim (PVC) đảm bảo dữ liệu cấu hình giám sát của Uptime Kuma không bị mất đi khi Pod bị khởi động lại.

1. **Khởi tạo Namespace `monitoring`** (nếu chưa có):
   ```bash
   kubectl create namespace monitoring
   ```

2. **Cấu hình lưu trữ vật lý trên NFS Server** (Thực hiện trên máy chủ NFS):
   ```bash
   sudo mkdir -p /data/monitoring
   sudo chown -R nobody:nogroup /data/
   sudo chmod -R 777 /data
   ```

3. **Áp dụng cấu hình PV & PVC**:
   Sử dụng file manifest [uptime-kuma-pv-pvc.yml](../storage/uptime-kuma-pv-pvc.yml) đã được cấu hình IP của NFS Server:
   ```bash
   kubectl apply -f on-premise/kubernetes/storage/uptime-kuma-pv-pvc.yml
   ```

4. **Kiểm tra trạng thái**:
   Đảm bảo PVC `uptime-kuma-pvc` đã ở trạng thái `Bound`:
   ```bash
   kubectl get pvc uptime-kuma-pvc -n monitoring
   ```

---

### BƯỚC 2: Add Repo, Setup Values và Cài đặt Uptime Kuma

Sử dụng Helm Chart để cài đặt nhanh chóng và đồng bộ cấu hình lưu trữ qua tệp `values.yaml`.

1. **Thêm Helm Repository**:
   ```bash
   helm repo add uptime-kuma https://dirsigler.github.io/uptime-kuma-helm
   helm repo update
   ```

2. **Chuẩn bị tệp `values.yaml`**:
   Sử dụng tệp mẫu cấu hình sẵn [values.yml.example](values.yml.example) để ánh xạ vào PVC đã tạo ở Bước 1:
   ```yaml
   volume:
     enabled: true
     accessMode: ReadWriteOnce
     existingClaim: "uptime-kuma-pvc"
   ```

3. **Tiến hành cài đặt**:
   ```bash
   helm install uptime-kuma uptime-kuma/uptime-kuma --values values.yaml --namespace monitoring
   ```

4. **Kiểm tra trạng thái hoạt động**:
   ```bash
   kubectl get pods -n monitoring -l app.kubernetes.io/name=uptime-kuma
   ```

---

### BƯỚC 3: Tạo Ingress cấu hình Domain

Để truy cập Web UI của Uptime Kuma từ bên ngoài thông qua tên miền `uptime.devops.hieuduyne.tech`, ta cấu hình Ingress sử dụng Ingress Nginx Controller.

1. **Áp dụng file cấu hình Ingress**:
   Sử dụng tệp [ingress.yml](ingress.yml) đã tạo:
   ```bash
   kubectl apply -f on-premise/kubernetes/uptime-kuma/ingress.yml
   ```

2. **Nội dung cấu hình Ingress**:
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: uptime-ingress
     namespace: monitoring
   spec:
     ingressClassName: nginx
     rules:
       - host: uptime.devops.hieuduyne.tech
         http:
           paths:
             - backend:
                 service:
                   name: uptime-kuma
                   port:
                     number: 3001
               path: /
               pathType: Prefix
   ```

3. **Kiểm tra trạng thái**:
   ```bash
   kubectl get ingress -n monitoring uptime-ingress
   ```

---

### BƯỚC 4: Sửa lỗi phân giải tên miền (Fix bug add host domain)

Khi chạy trong mạng nội bộ Kubernetes (On-premise), Pod Uptime Kuma hoặc các dịch vụ khác có thể không phân giải được chính xác tên miền `uptime.devops.hieuduyne.tech` do chưa có DNS công khai hoặc DNS nội bộ chưa đồng bộ.

Để giải quyết vấn đề này, ta cần thêm cấu hình ánh xạ IP của Node chạy Ingress Nginx (hoặc Load Balancer) trực tiếp vào file `/etc/hosts` của Pod (sử dụng cơ chế `HostAliases`).

#### Cách 1: Thao tác trực tiếp trên giao diện Rancher UI (Khuyên dùng)
1. Truy cập **Rancher UI** > Chọn Cluster đang chạy.
2. Menu bên trái, vào mục **Workloads** > Tìm ứng dụng `uptime-kuma` (hoặc `kuma-uptime`).
3. Click vào dấu 3 chấm góc phải > Chọn **Edit Config**.
4. Di chuyển xuống phần cấu hình **Pod** > Mở tab **Networking**.
5. Tìm mục **Add Alias** (Host Aliases).
6. Nhập thông tin ánh xạ:
   - **IP**: Địa chỉ IP của máy chủ chạy Ingress Controller hoặc Nginx Load Balancer (Ví dụ: `192.168.1.115`).
   - **Hostnames**: `uptime.devops.hieuduyne.tech`
7. Click **Save** để áp dụng. Pod sẽ tự động restart và nhận cấu hình mới.

#### Cách 2: Cấu hình trực tiếp bằng YAML Manifest (HostAliases)
Nếu bạn triển khai bằng YAML hoặc muốn chỉnh sửa thông qua `kubectl edit`, hãy thêm phần `hostAliases` vào dưới trường `spec.template.spec` trong Deployment của Uptime Kuma:

```yaml
spec:
  template:
    spec:
      hostAliases:
        - ip: "192.168.1.115" # Điền IP của Ingress Controller / Load Balancer của bạn
          hostnames:
            - "uptime.devops.hieuduyne.tech"
```

Áp dụng thay đổi để Pod tự động cập nhật file `/etc/hosts` nội bộ:
```bash
kubectl edit deployment uptime-kuma -n monitoring
```
