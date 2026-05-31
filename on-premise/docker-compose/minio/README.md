# Cấu Hình Triển Khai MinIO Bằng Docker Compose

Thư mục này chứa cấu hình mẫu để triển khai nhanh máy chủ lưu trữ đối tượng **MinIO** (tương thích chuẩn Amazon S3 API) bằng Docker Compose, phục vụ lưu trữ file, backup hoặc làm backend lưu trữ dữ liệu tĩnh.

---

## 1. Thông số cấu hình cốt lõi

Cấu hình docker-compose ghim phiên bản cụ thể `RELEASE.2023-02-27T18-10-45Z` nhằm duy trì giao diện quản trị cũ (Console UI) đơn giản, trực quan và dễ thao tác.

### Danh sách cổng kết nối (Ports)
*   **Port 9000**: Cổng API chính của MinIO. Được sử dụng để các phần mềm, mã nguồn ứng dụng hoặc SDK kết nối và truyền nhận dữ liệu (S3 Endpoint).
*   **Port 9001**: Cổng giao diện quản trị web (Console UI). Dùng để quản trị viên đăng nhập cấu hình, tạo bucket và phân quyền bằng trình duyệt.

### Thông tin tài khoản mặc định (Credentials)
*   **Access Key (User)**: `h1eudayne`
*   **Secret Key (Password)**: `1`

### Lưu trữ dữ liệu (Volume Persistence)
Dữ liệu tải lên MinIO sẽ được lưu trữ bền vững tại thư mục `./storage` trên máy chủ vật lý, được gắn kết trực tiếp vào thư mục `/data` bên trong container.

---

## 2. Hướng dẫn chạy dịch vụ

Thực hiện các bước sau từ terminal tại thư mục này:

### Bước 1: Sao chép tệp cấu hình mẫu
Tạo file chạy thực tế từ file cấu hình mẫu:
```bash
cp docker-compose.yml.example docker-compose.yml
```

### Bước 2: Khởi chạy dịch vụ
Khởi động container chạy ngầm trong nền hệ thống:
```bash
docker compose up -d
```

### Bước 3: Kiểm tra trạng thái hoạt động
Đảm bảo container hoạt động bình thường và không gặp lỗi:
```bash
docker compose ps
```

### Bước 4: Truy cập quản trị
Mở trình duyệt web của bạn và truy cập giao diện quản lý đồ họa của MinIO theo đường dẫn:
```text
http://<IP_MAY_CHU>:9001
```
Đăng nhập bằng tài khoản quản trị viên mặc định (`h1eudayne` / `1`) để tiến hành tạo Buckets mới.
