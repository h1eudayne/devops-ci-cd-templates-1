# 2. AWS Lambda Hands-on Lab (Resize ảnh tự động trên Amazon S3) - Hướng dẫn chi tiết

👉 **[Xem Đề bài / Yêu cầu bài Lab](2.%20AWS%20Lambda%20Hands-on%20Lab%28Resize%20Image%20on%20S3%29.md)**

## Các bước thực hiện chi tiết

### Bước 1: Tạo S3 Bucket

Khởi tạo một S3 Bucket trên AWS Console. Bucket này sẽ được cấu hình để gửi sự kiện (Trigger) kích hoạt hàm Lambda khi có tệp tin hình ảnh mới được upload lên.

---

### Bước 2: Chuẩn bị Lambda Layer chứa thư viện Pillow

> [!IMPORTANT]
> Thư viện **Pillow** cần phải được biên dịch (build) tương thích với hệ điều hành **Amazon Linux 2** (môi trường chạy của Lambda), không phải Windows hay macOS. Nếu cài đặt không đúng môi trường chạy, bạn sẽ gặp lỗi sau:
> ```text
> [ERROR] Runtime.ImportModuleError: Unable to import module 'lambda_function': 
> cannot import name '_imaging' from 'PIL'
> ```

Để đóng gói Layer tương thích, thực hiện theo các bước sau:

#### 1. Tạo thư mục `python`
```bash
mkdir python
```

#### 2. Cài đặt thư viện Pillow chỉ định platform và runtime tương thích

**Sử dụng Bash / Git Bash / WSL (Lệnh viết trên 1 dòng):**
```bash
pip install Pillow --platform manylinux2014_x86_64 --target python --implementation cp --python-version 3.12 --only-binary=:all: --no-deps --upgrade
```

**Sử dụng PowerShell (Lệnh viết trên nhiều dòng):**
```powershell
pip install Pillow `
    --platform manylinux2014_x86_64 `
    --target python `
    --implementation cp `
    --python-version 3.12 `
    --only-binary=:all: `
    --no-deps `
    --upgrade
```

#### 3. Nén thư mục thành file zip
Nén thư mục `python` vừa tạo thành tệp tin `python.zip`.

#### 4. Upload Layer lên AWS Lambda
1. Truy cập giao diện **AWS Lambda Console** $\rightarrow$ **Layers** $\rightarrow$ **Create layer**.
2. Thiết lập cấu hình:
   * **Name**: `python-pillow-layer`.
   * **Upload**: Chọn tải lên tệp `python.zip`.
   * **Compatible architectures**: Tích chọn `x86_64`.
   * **Compatible runtimes**: Chọn `Python 3.12`.
3. Nhấp chọn **Create**.

---

### Bước 3: Tạo Lambda Function

1. Truy cập **AWS Lambda Console** $\rightarrow$ **Create function**.
2. Thiết lập các thông số:
   * **Function name**: `resize-image-lambda`.
   * **Runtime**: Chọn **Python 3.12**.
   * **Architecture**: Chọn **x86_64**.
3. Nhấp chọn **Create function**.

---

### Bước 4: Thêm Layer vào Lambda Function

1. Tại giao diện chi tiết của hàm Lambda vừa tạo, cuộn xuống dưới cùng đến mục **Layers**.
2. Nhấp nút **Add a layer**.
3. Chọn **Custom layers**.
4. Tìm và chọn `python-pillow-layer` với version mới nhất bạn vừa tạo ở Bước 2.
5. Nhấp chọn **Add**.

---

### Bước 5: Cấu hình mã nguồn và tài nguyên cho Lambda

1. Cập nhật mã nguồn trong tệp `lambda_function.py` bằng nội dung từ file [lambda_function.py](lambda_function.py).
2. Tăng thời gian chạy tối đa (Timeout): Chọn tab **Configuration** $\rightarrow$ **General configuration** $\rightarrow$ **Edit** $\rightarrow$ Thiết lập **Timeout** tối thiểu là **30 giây** (mặc định là 3 giây, có thể bị hết thời gian khi xử lý ảnh lớn).
3. Tăng dung lượng bộ nhớ (Memory): Thiết lập **Memory** tối thiểu là **512 MB** để cải thiện tốc độ xử lý ảnh của Pillow.

---

### Bước 6: Cấu hình S3 Trigger

1. Tại giao diện Lambda, nhấp chọn **Add trigger** ở phần Function overview.
2. Chọn dịch vụ **S3**.
3. **Bucket**: Chọn S3 bucket bạn đã tạo ở Bước 1.
4. **Event type**: Chọn **All object create events**.
5. **Prefix**: Điền `images/` (chỉ kích hoạt khi upload vào thư mục này).
6. **Suffix**: Điền `.jpg` (hoặc để trống để hỗ trợ nhiều định dạng ảnh).
7. Tích chọn hộp thoại xác nhận cảnh báo gọi đệ quy (Recursive invocation).
8. Nhấp chọn **Add**.

---

### Bước 7: Chạy thử và Kiểm nghiệm kết quả (Test)

1. Tải một file ảnh có định dạng `.jpg` lên thư mục `images/` trong S3 Bucket của bạn. *Lưu ý: Tên ảnh không nên chứa ký tự đặc biệt!*
2. Kiểm tra log thực thi của hàm Lambda trong **CloudWatch Logs**.
3. Xác nhận các thư mục con sau tự động được tạo và chứa các phiên bản ảnh đã resize tương ứng:
   * `resized_100/`
   * `resized_200/`
   * `resized_500/`
   * `resized_1000/`

---

## Các lỗi thường gặp và Cách khắc phục (Troubleshooting)

### 1. Lỗi: "cannot import name '_imaging' from 'PIL'"
* **Nguyên nhân**: Thư viện Pillow được nén và đóng gói trên môi trường Windows hoặc macOS, dẫn đến thiếu hoặc không tương thích các thư viện liên kết động C (C extensions) trên Amazon Linux.
* **Cách khắc phục**: Xóa Layer cũ và đóng gói lại tệp zip bằng lệnh pip chứa tham số `--platform manylinux2014_x86_64` như hướng dẫn ở Bước 2.

### 2. Lỗi: "Task timed out"
* **Nguyên nhân**: Thời gian xử lý ảnh dung lượng lớn vượt quá cấu hình mặc định (3 giây) của Lambda.
* **Cách khắc phục**: Tăng cấu hình timeout của Lambda lên 30 - 60 giây trong Configuration.

### 3. Lỗi: "Memory limit exceeded"
* **Nguyên nhân**: Bộ nhớ RAM mặc định (128 MB) không đủ để Pillow load và xử lý ảnh lớn.
* **Cách khắc phục**: Tăng bộ nhớ RAM cấu hình của Lambda lên ít nhất 512 MB.

---

* **Bài trước**: [1. Hello Lambda (Làm quen với AWS Lambda Console)](../1.%20Hello%20Lambda.md)
* **Bài tiếp theo**: [3. AWS Lambda Hands-on Lab(EC2 Auto Start-Stop) (Lab bật tắt EC2 tự động)](../3.%20AWS%20Lambda%20Hands-on%20Lab%28EC2%20Auto%20Start-Stop%29/3.%20AWS%20Lambda%20Hands-on%20Lab%28EC2%20Auto%20Start-Stop%29.md)

---

👉 **[Quay lại Đề bài](2.%20AWS%20Lambda%20Hands-on%20Lab%28Resize%20Image%20on%20S3%29.md)**
