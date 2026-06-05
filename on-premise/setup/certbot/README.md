# Cài đặt và cấu hình Certbot (Let's Encrypt SSL/TLS)

Tài liệu này hướng dẫn cách cài đặt Certbot để xin cấp phát chứng chỉ SSL/TLS miễn phí từ Let's Encrypt, cấu hình tự động gia hạn và tích hợp với Nginx.

---

### I. Cài đặt Certbot và các gói phụ trợ
Chạy lệnh sau trên máy chủ (Ubuntu/Debian) để cài đặt Certbot cùng với các gói bổ trợ:
```bash
sudo apt update
sudo apt install apache2-utils certbot python3-certbot-nginx -y
```
*   **`certbot`**: Công cụ chính để xin và quản lý chứng chỉ SSL/TLS Let's Encrypt.
*   **`python3-certbot-nginx`**: Plugin giúp Certbot tự động cấu hình SSL trực tiếp vào các file cấu hình của Nginx.
*   **`apache2-utils`**: Cung cấp công cụ sinh mật khẩu (`htpasswd`) cho xác thực basic auth nếu cần.

---

### II. Xin cấp chứng chỉ SSL/TLS (Chế độ Standalone)
Chế độ `standalone` sử dụng một máy chủ web tạm thời tích hợp sẵn trong Certbot để xác thực tên miền qua cổng `80` (HTTP).

> [!WARNING]
> **Lưu ý:** Cổng `80` trên máy chủ phải đang ở trạng thái trống (không có Nginx hay dịch vụ nào khác đang chạy chiếm dụng cổng 80 trong quá trình xác thực). Nếu Nginx đang chạy, hãy tạm dừng bằng lệnh `sudo systemctl stop nginx`.

Chạy lệnh sau để xin chứng chỉ (Ví dụ cho tên miền `teleport-onpre.h1eudayne.work` và email đăng ký `voduchieu42@gmail.com`):
```bash
sudo certbot certonly --standalone \
  -d teleport-onpre.h1eudayne.work \
  --preferred-challenges http \
  --agree-tos \
  -m voduchieu42@gmail.com \
  --keep-until-expiring
```

**Giải thích các tùy chọn:**
*   `certonly`: Chỉ xin chứng chỉ về máy, không tự động chỉnh sửa cấu hình web server.
*   `--standalone`: Sử dụng máy chủ web tạm thời của Certbot để xác thực.
*   `-d <domain>`: Tên miền phụ hoặc tên miền chính muốn xin chứng chỉ.
*   `--preferred-challenges http`: Phương thức xác thực thông qua cổng HTTP.
*   `--agree-tos`: Đồng ý với các điều khoản dịch vụ của Let's Encrypt.
*   `-m <email>`: Email đăng ký nhận thông báo cảnh báo khi chứng chỉ sắp hết hạn.
*   `--keep-until-expiring`: Giữ nguyên chứng chỉ cũ nếu chưa đến hạn gia hạn.

Sau khi hoàn tất thành công, các tệp tin chứng chỉ sẽ được lưu trữ tại:
*   **Certificate (Full Chain):** `/etc/letsencrypt/live/<domain>/fullchain.pem`
*   **Private Key:** `/etc/letsencrypt/live/<domain>/privkey.pem`

---

### III. Tự động gia hạn (Auto-renewal)
Chứng chỉ Let's Encrypt có thời hạn hiệu lực là 90 ngày. Mặc định sau khi cài đặt, một timer systemd của Certbot sẽ tự động chạy định kỳ để gia hạn chứng chỉ khi thời gian hiệu lực còn dưới 30 ngày.

Kiểm tra quá trình mô phỏng gia hạn (dry-run) để đảm bảo dịch vụ tự động hoạt động tốt:
```bash
sudo certbot renew --dry-run
```
