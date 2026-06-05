# Bài 6: Cài đặt Teleport

Tài liệu này hướng dẫn các bước cài đặt thủ công Teleport từ gói binary chính thức trên hệ điều hành Linux (Ubuntu/Debian), cấu hình đường dẫn thực thi và chuẩn bị thư mục cấu hình cho hệ thống.

---

### I. Quy trình cài đặt Teleport từ Binary

Cài đặt Teleport từ gói binary tải trực tiếp từ trang chủ giúp chúng ta kiểm soát tốt phiên bản cài đặt và cấu trúc thư mục của hệ thống.

Dưới đây là các bước thực hiện trên server chạy Linux:

#### 1. Tải về gói cài đặt Teleport
Sử dụng công cụ `wget` để tải phiên bản Teleport (ở đây sử dụng phiên bản `v13.2.0`):
```bash
wget https://get.gravitational.com/teleport-v13.2.0-linux-amd64-bin.tar.gz
```

#### 2. Giải nén gói cài đặt
Giải nén tệp tin lưu trữ dạng `.tar.gz` vừa tải về:
```bash
tar -xzf teleport-v13.2.0-linux-amd64-bin.tar.gz
```
Sau khi giải nén, một thư mục có tên `teleport/` sẽ được tạo ra chứa các tệp tin thực thi (binary).

#### 3. Cài đặt các tệp tin thực thi vào hệ thống
Di chuyển các tệp thực thi chính của Teleport vào thư mục `/usr/local/bin/` để hệ điều hành có thể nhận diện lệnh ở bất cứ đâu (nằm trong biến môi trường `$PATH` mặc định):
```bash
sudo mv teleport/tctl /usr/local/bin/
sudo mv teleport/tsh /usr/local/bin/
sudo mv teleport/teleport /usr/local/bin/
```
*   **`teleport`**: Tiến trình daemon chính chạy Teleport Server.
*   **`tctl`**: Công cụ CLI quản trị dành cho Admin (dùng để quản lý người dùng, tạo token, quản lý node...).
*   **`tsh`**: Công cụ CLI Client dành cho người dùng kết nối SSH và quản trị.

#### 4. Xác minh cài đặt thành công
Kiểm tra phiên bản của cả 3 công cụ vừa cài đặt để đảm bảo chúng hoạt động bình thường:
```bash
teleport version && tctl version && tsh version
```
*(Kết quả hiển thị phiên bản Teleport v13.2.0 cùng với Git commit hash)*

#### 5. Khởi tạo thư mục cấu hình
Tạo thư mục `/etc/teleport` để chuẩn bị chứa tệp tin cấu hình (`teleport.yaml`) của Teleport:
```bash
sudo mkdir -p /etc/teleport
```
