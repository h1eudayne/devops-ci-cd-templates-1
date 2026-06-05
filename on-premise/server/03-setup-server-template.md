# Bài 3: Khởi tạo hạ tầng Server Template

Tài liệu này hướng dẫn chi tiết các bước khởi tạo một máy chủ ảo làm mẫu (Server Template) trên hạ tầng on-premise, bao gồm cấu hình mạng NAT, IP tĩnh và thiết lập SSH cho user root.

---

### 1. New virtual (Tạo máy ảo mới)
* Khi tạo máy ảo mới (Ubuntu Server), hãy thiết lập cấu hình mạng là **NAT**.

### 2. SSH vào server
* Sử dụng tài khoản user mặc định được tạo trong quá trình cài đặt hệ điều hành để truy cập SSH vào server.

### 3. Setup IP tĩnh
* Chỉnh sửa cấu hình mạng Netplan tại đường dẫn:
  ```bash
  sudo vi /etc/netplan/00-installer-config.yaml
  ```
  *(Lưu ý: Tên file cấu hình Netplan mặc định trên Ubuntu thường gặp nhất là `00-installer-config.yaml` hoặc `01-netcfg.yaml`)*.

### 4. Thiết lập login bằng user root
* Để cho phép đăng nhập trực tiếp bằng tài khoản `root` qua SSH, chỉnh sửa file cấu hình SSH Daemon:
  ```bash
  sudo vi /etc/ssh/sshd_config
  ```
* Tìm và sửa (hoặc thêm) dòng cấu hình sau:
  ```text
  PermitRootLogin yes
  ```
* Khởi động lại dịch vụ SSH để áp dụng cấu hình mới:
  ```bash
  sudo systemctl restart ssh
  ```

### 5. Đặt password cho user root
* Thiết lập mật khẩu cho tài khoản `root` bằng lệnh:
  ```bash
  sudo passwd root
  ```

### 6. SSH bằng user root
* Truy cập lại vào máy chủ bằng tài khoản `root` và địa chỉ IP tĩnh đã thiết lập ở bước 3:
  ```bash
  ssh root@<ip_tinh>
  ```
