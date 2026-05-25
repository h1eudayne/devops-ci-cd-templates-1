# Hướng dẫn Cấu hình và Triển khai Cơ sở dữ liệu MariaDB trên Kubernetes sử dụng NFS Storage

Tài liệu này hướng dẫn chi tiết quy trình triển khai cơ sở dữ liệu **MariaDB** trên cụm Kubernetes, tích hợp lưu trữ chia sẻ **NFS** và cấu hình Service truy cập (ClusterIP nội bộ bảo mật hoặc NodePort mở cổng bên ngoài).

---

## 1. Lưu ý Cực kỳ Quan trọng: Tại sao chọn StatefulSet thay vì Deployment?

Khi triển khai các ứng dụng cơ sở dữ liệu (như MariaDB, MySQL, PostgreSQL) trên Kubernetes, **StatefulSet** là giải pháp bắt buộc thay vì Deployment vì các lý do sau:

| Đặc điểm | StatefulSet (Khuyến nghị cho DB) | Deployment (Phù hợp cho Stateless Web) |
| :--- | :--- | :--- |
| **Định danh Pod** | Cố định và có thứ tự tăng dần từ 0 (Ví dụ: `mariadb-0`). | Ngẫu nhiên và thay đổi mỗi khi Pod khởi động lại (Ví dụ: `mariadb-7d84b`). |
| **Gắn kết Ổ cứng (PV/PVC)** | Ánh xạ cố định 1-1 giữa Pod và Volume. Pod `mariadb-0` khi khởi động lại luôn gắn kết đúng ổ đĩa cũ của nó. | Các Pod chia sẻ hoặc gắn kết ngẫu nhiên vào các Volume có sẵn, dễ gây xung đột ghi dữ liệu. |
| **Định danh Mạng** | Có DNS nội bộ cố định thông qua Headless Service (Ví dụ: `mariadb-0.mariadb-service`). | Không có DNS cố định cho từng Pod đơn lẻ. |
| **Thứ tự triển khai** | Khởi tạo, cập nhật hoặc xóa bỏ theo thứ tự tuần tự (từ 0 đến N-1) giúp tránh lỗi đồng bộ dữ liệu. | Triển khai đồng thời không theo thứ tự (Non-ordered). |

---

## 2. Quy trình 3 Bước Triển khai Cơ sở dữ liệu

### Bước 1: Điều chỉnh và cấu hình NFS Server
Để đảm bảo cơ sở dữ liệu ghi chép dữ liệu trơn tru lên NFS Server (`database-server`), cấu hình thư mục chia sẻ cần phải đáp ứng các tiêu chuẩn phân quyền sau:

1. **Phân quyền thư mục vật lý:**
   ```bash
   # Tạo thư mục dữ liệu trên database-server
   sudo mkdir -p /data
   
   # Gán quyền sở hữu cho nobody:nogroup (để tránh lỗi phân quyền từ phía client)
   sudo chown -R nobody:nogroup /data
   
   # Cấp quyền ghi đọc tối đa
   sudo chmod -R 777 /data
   ```

2. **Cấu hình xuất bản `/etc/exports`:**
   Mở tệp tin `/etc/exports` và chỉnh sửa:
   ```text
   /data *(rw,sync,no_subtree_check,no_root_squash)
   ```
   > [!IMPORTANT]
   > Tùy chọn **`no_root_squash`** là bắt buộc. Nếu thiếu tùy chọn này, các yêu cầu ghi dữ liệu dưới quyền `root` từ phía Pod Kubernetes sẽ bị hạ quyền xuống `nobody`, gây ra lỗi khởi tạo database (`Permission Denied` trong tệp tin logs của MariaDB).

3. **Áp dụng cấu hình:**
   ```bash
   sudo exportfs -rav
   sudo systemctl restart nfs-kernel-server
   ```

---

### Bước 2: Triển khai StatefulSet MariaDB
Sử dụng mẫu cấu hình dưới đây để khởi chạy Pod MariaDB. Lưu ý cấu hình bảo mật `fsGroup` để tự động ánh xạ quyền ghi đĩa.

- **Tệp cấu hình:** [mariadb-statefulset.yml.example](../templates/kubernetes/statefulset/mariadb-statefulset.yml.example)
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mariadb
  namespace: ecommerce
spec:
  serviceName: mariadb-service # Tên Headless Service quản lý định danh mạng
  replicas: 1
  selector:
    matchLabels:
      app: mariadb
  template:
    metadata:
      labels:
        app: mariadb
    spec:
      securityContext:
        fsGroup: 65534 # Trùng với GID nogroup của NFS Server để giải quyết quyền ghi
      containers:
        - name: mariadb
          image: mariadb:latest
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "devopseduvn" # Mật khẩu quản trị cơ sở dữ liệu
          ports:
            - containerPort: 3306
              name: mysql
          volumeMounts:
            - name: mariadb-storage
              mountPath: /var/lib/mysql # Thư mục lưu trữ tệp tin DB trong container
      volumes:
        - name: mariadb-storage
          persistentVolumeClaim:
            claimName: nfs-pvc # Trỏ tới PVC đã liên kết với NFS Server
```

---

### Bước 3: Triển khai Service Expose MariaDB (2 Cách)

Để ứng dụng kết nối được đến cơ sở dữ liệu MariaDB, ta có 2 phương pháp cấu hình Service tùy theo nhu cầu bảo mật và môi trường:

#### CÁCH 1: Sử dụng ClusterIP (KHUYẾN NGHỊ CHO PRODUCTION)
- **Mô tả:** Chỉ cho phép truy cập nội bộ trong cụm K8s. Các ứng dụng khác (như Backend) kết nối tới MariaDB cực kỳ an toàn qua DNS nội bộ của Service mà không lo bị lộ cổng ra ngoài Internet.
- **Tệp cấu hình:** [mariadb-service.yml.example](../templates/kubernetes/service/mariadb-service.yml.example)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mariadb-service
  namespace: ecommerce
spec:
  selector:
    app: mariadb # Ánh xạ tới StatefulSet MariaDB
  type: ClusterIP # Chỉ truy cập nội bộ trong cụm
  ports:
    - port: 3306      # Cổng giao tiếp của Service trong cụm
      targetPort: 3306 # Cổng container MariaDB lắng nghe
```
*DNS kết nối nội bộ:* `mariadb-service.ecommerce.svc.cluster.local:3306`

#### CÁCH 2: Sử dụng NodePort (PHÙ HỢP CHO LIÊN KẾT NGOÀI & TEST)
- **Mô tả:** Mở cổng vật lý `31306` trên tất cả các node trong cụm Kubernetes. Giúp DevOps/Developer kết nối trực tiếp đến cơ sở dữ liệu bằng các công cụ bên ngoài (DBeaver, Navicat, CLI) để quản trị và kiểm thử.
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mariadb-service
  namespace: ecommerce
spec:
  selector:
    app: mariadb
  type: NodePort # Cho phép truy cập từ bên ngoài qua IP của Node
  ports:
    - port: 3306      
      targetPort: 3306 
      nodePort: 31306  # Cổng vật lý expose trên các Node K8s (30000-32767)
```

---

## 3. Liên kết luồng kiến trúc lưu trữ và dịch vụ

Hệ thống hoạt động dựa trên các thành phần đã thiết lập trước đó theo luồng kết nối tuần tự:

```text
[NFS Server: database-server (/data)]
               ▲
               │ (Giao thức NFS - cổng 2049)
               ▼
[NFS Client: các Node k8s (nfs-common)] ──► [K8s PV: nfs-pv] ──► [K8s PVC: nfs-pvc]
                                                                        ▲
                                                                        │ (Volume Mount)
                                                                        ▼
                                                             [StatefulSet: mariadb-0]
                                                                        ▲
                                                 ┌──────────────────────┴──────────────────────┐
                                                 │                                             │
                                                 ▼ (Cách 1 - ClusterIP)                        ▼ (Cách 2 - NodePort)
                                     [mariadb-service: 3306]                        [mariadb-service: 31306]
                                                 │                                             │
                                                 ▼ (Nội bộ K8s)                                ▼ (Internet / Bên ngoài)
                                      [Backend App / Web Pod]                       [Navicat / DBeaver / DevOps]
```

## 4. Các lệnh kiểm tra vận hành nhanh

### 1. Kiểm tra trạng thái triển khai cơ sở dữ liệu:
```bash
# Kiểm tra Pod đang chạy
kubectl get pods -l app=mariadb -n ecommerce -o wide

# Kiểm tra nhật ký khởi tạo cơ sở dữ liệu của MariaDB
kubectl logs statefulset/mariadb -n ecommerce
```

### 2. Kiểm tra kết nối cơ sở dữ liệu:

- **Nếu dùng Cách 1 (ClusterIP) - Test từ một Pod tạm thời bên trong cụm K8s:**
  ```bash
  # Khởi chạy một pod temporary chạy mysql-client để kết nối thử
  kubectl run mysql-client --rm -i --tty --image=mariadb --namespace=ecommerce -- mysql -h mariadb-service -u root -pdevopseduvn
  ```

- **Nếu dùng Cách 2 (NodePort) - Kết nối từ bên ngoài mạng Kubernetes:**
  Thử kết nối tới cổng `31306` của bất kỳ Node K8s nào:
  ```bash
  mysql -h <K8S_NODE_IP> -P 31306 -u root -pdevopseduvn
  ```
  hoặc kiểm tra cổng mở nhanh bằng:
  ```bash
  nc -zv <K8S_NODE_IP> 31306
  ```
