# Hướng Dẫn Cài Đặt Velero Client Trên Kubernetes

Tài liệu này hướng dẫn cách cài đặt công cụ dòng lệnh Velero CLI (Client) trên máy chủ điều khiển (k8s-master-1) hoặc thông qua Kubectl Shell trên giao diện quản trị Rancher để sẵn sàng thực hiện các tác vụ sao lưu (backup) và khôi phục (restore) tài nguyên trong cụm Kubernetes.

---

## 1. Yêu cầu chuẩn bị
*   Quyền truy cập trực tiếp vào máy chủ Master của cụm Kubernetes (ví dụ: `k8s-master-1`) qua SSH hoặc sử dụng công cụ dòng lệnh Kubectl Shell tích hợp sẵn trên Rancher.
*   Công cụ `kubectl` đã được cấu hình kết nối thành công tới cụm (cluster).

---

## 2. Các bước cài đặt Velero CLI

Thực hiện tuần tự các câu lệnh sau từ terminal:

### Bước 1: Tải xuống gói cài đặt Velero Client
Tải bản phát hành ổn định Velero v1.15.0 dành cho kiến trúc hệ điều hành Linux amd64 trực tiếp từ kho lưu trữ GitHub của dự án:
```bash
wget https://github.com/vmware-tanzu/velero/releases/download/v1.15.0/velero-v1.15.0-linux-amd64.tar.gz
```

### Bước 2: Giải nén gói cài đặt
Sử dụng công cụ `tar` để giải nén tệp tin vừa tải về:
```bash
tar -xvf velero-v1.15.0-linux-amd64.tar.gz
```

### Bước 3: Di chuyển tệp tin thực thi vào đường dẫn hệ thống
Di chuyển tệp tin binary `velero` vào thư mục `/usr/local/bin/` dưới quyền quản trị (sudo) để hệ điều hành nhận diện lệnh trên toàn hệ thống:
```bash
sudo mv velero-v1.15.0-linux-amd64/velero /usr/local/bin
```

---

## 3. Xác minh cài đặt và dọn dẹp

### Bước 1: Kiểm tra phiên bản Velero Client
Chạy lệnh sau để đảm bảo hệ thống đã nhận diện chính xác công cụ Velero CLI:
```bash
velero version --client-only
```
*Kết quả hiển thị chính xác sẽ trả về thông tin phiên bản Client: `Version: v1.15.0`.*

### Bước 2: Dọn dẹp tệp tin tạm thời
Sau khi cài đặt thành công, tiến hành xóa tệp tin nén và thư mục giải nén tạm thời để giải phóng dung lượng ổ đĩa của máy chủ:
```bash
rm -rf velero-v1.15.0-linux-amd64.tar.gz velero-v1.15.0-linux-amd64
```
