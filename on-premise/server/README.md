# Quản Trị Máy Chủ & Hệ Điều Hành (Server Administration)

Thư mục này chứa tài liệu và cấu hình phục vụ việc khởi tạo, quản trị hệ điều hành và thiết lập máy chủ ảo mẫu trên môi trường on-premise.

## Danh Sách Bài Học

1. **[Bài 3: Khởi tạo hạ tầng Server Template](./03-setup-server-template.md)**
   * Quy trình tạo máy ảo mới cấu hình mạng NAT.
   * Thiết lập IP tĩnh bằng Netplan.
   * Cấu hình SSH Daemon cho phép tài khoản root đăng nhập trực tiếp.

2. **[Bài 4: Phương pháp lựa chọn công nghệ quản lý truy cập server](./04-server-access-management.md)**
   * So sánh xác thực SSH bằng mật khẩu vs SSH Key.
   * Các tiêu chí chọn công cụ quản lý truy cập hạ tầng (Web service, bảo mật, audit logging, MFA).
   * Giới thiệu phần mềm Teleport Gateway.

3. **[Bài 5: Triển khai công cụ quản lý truy cập máy chủ (Teleport)](./05-deploy-server-access-management.md)**
   * Đánh giá ưu điểm/nhược điểm khi triển khai Teleport trên On-Premise.
   * Cấu hình DNS Record trỏ domain về IP Public của server.
   * Cài đặt và kiểm tra Nginx Load Balancer ban đầu.
   * Cấu hình Port Forwarding bằng Cloudflare Tunnel (Zero Trust).

4. **[Bài 6: Cài đặt Teleport](./06-install-teleport.md)**
   * Quy trình tải gói cài đặt binary Teleport v13.2.0.
   * Giải nén và phân phối các file thực thi (teleport, tctl, tsh) vào hệ thống.
   * Xác minh cài đặt và khởi tạo thư mục cấu hình `/etc/teleport`.



