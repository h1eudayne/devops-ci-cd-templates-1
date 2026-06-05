# Cloudflare Services & Templates

Thư mục này chứa tài liệu và cấu hình liên quan đến dịch vụ của Cloudflare (DNS, Cloudflare Tunnel, Zero Trust, WAF, CDN, Workers).

## Cấu trúc thư mục

```text
cloud/cloudflare/
├── README.md            # (file này)
├── services/            # Giới thiệu các dịch vụ của Cloudflare
└── deploy/              # File cấu hình, manifest cho cloudflared
```

## Các dịch vụ chính của Cloudflare trong DevOps

| Dịch vụ | Vai trò chính | Khi nào sử dụng? |
| --- | --- | --- |
| **DNS Management** | Quản lý bản ghi tên miền (A, CNAME, TXT, MX...) | Khi cần trỏ tên miền về hạ tầng On-Premise hoặc Cloud, cấu hình Proxy ẩn IP gốc. |
| **Cloudflare Tunnel** | Kết nối an toàn (secure tunnel) từ server nội bộ ra ngoài Internet | Khi cần cho phép truy cập từ Internet vào Web Service nội bộ mà không cần mở port trên Modem (Port Forwarding). |
| **Zero Trust Access** | Xác thực và phân quyền truy cập tập trung dựa trên danh tính (IdP) | Thay thế VPN truyền thống, bảo mật quyền truy cập vào các cổng quản trị (Teleport, Jenkins, GitLab). |
| **WAF (Web Application Firewall)** | Chống tấn công DDoS, lọc lưu lượng xấu, chặn IP độc hại | Bảo vệ các ứng dụng web public khỏi các lỗ hổng OWASP Top 10. |
| **Cloudflare Workers** | Chạy serverless code trên hạ tầng Edge của Cloudflare | Tối ưu hóa định tuyến, thay đổi header, xử lý API nhanh ở biên. |

---

## So sánh Giải pháp kết nối (Modem NAT vs Cloudflare Tunnel)

### 1. Cấu hình NAT/Port Forwarding trên Modem
*   **Nguyên lý:** Nhận kết nối trực tiếp từ Internet vào IP Public của Modem, sau đó Modem chuyển tiếp (NAT) kết nối đó vào IP nội bộ của máy chủ Load Balancer.
*   **Điểm yếu:**
    *   Phải mở cổng inbound trên Modem (nguy cơ bị quét port và tấn công trực tiếp).
    *   Cần IP Public tĩnh hoặc cấu hình DDNS động phức tạp khi nhà mạng đổi IP.
    *   Khó cấu hình nếu hạ tầng mạng có nhiều lớp modem đứng trước.

### 2. Sử dụng Cloudflare Tunnel (Khuyên dùng)
*   **Nguyên lý:** Connector `cloudflared` trên server nội bộ chủ động thiết lập kết nối outbound (gọi ra) tới Cloudflare. Mọi luồng truy cập đi qua Proxy Cloudflare sẽ được đưa qua kết nối này vào server nội bộ.
*   **Ưu điểm:**
    *   **Bảo mật tối đa:** Không mở bất kỳ cổng inbound nào trên modem nội bộ (Closed inbound ports).
    *   Không quan tâm IP Public thay đổi hay dùng IP động.
    *   Tự động tích hợp chứng chỉ SSL/TLS miễn phí từ Cloudflare.
    *   Tích hợp sẵn bộ lọc DDoS và bảo vệ của WAF.
