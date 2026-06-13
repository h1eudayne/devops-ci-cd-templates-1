import boto3
import os
import uuid
from urllib.parse import unquote_plus
from PIL import Image

s3_client = boto3.client('s3')

def resize_image(image_path, resized_path):
    with Image.open(image_path) as image:
        # Co nhỏ ảnh giữ nguyên tỉ lệ, tối đa 300px cho chiều rộng/cao
        image.thumbnail((300, 300))
        image.save(resized_path)

def lambda_handler(event, context):
    for record in event['Records']:
        # Lấy thông tin Bucket nguồn và Tên ảnh từ sự kiện
        source_bucket = record['s3']['bucket']['name']
        image_key = unquote_plus(record['s3']['object']['key'])
        
        # Tạo tên file tạm thời trong thư mục /tmp của Lambda
        temp_file_name = f"{uuid.uuid4()}-{os.path.basename(image_key)}"
        download_path = f"/tmp/{temp_file_name}"
        upload_path = f"/tmp/resized-{temp_file_name}"
        
        # 1. Tải ảnh từ S3 Bucket Nguồn về /tmp
        s3_client.download_file(source_bucket, image_key, download_path)
        
        # 2. Thực hiện Resize ảnh sử dụng thư viện Pillow
        resize_image(download_path, upload_path)
        
        # 3. Định nghĩa S3 Bucket đích và Upload ảnh lên
        target_bucket = source_bucket.replace("-source", "-resized")
        s3_client.upload_file(upload_path, target_bucket, image_key)
        
        print(f"Thành công! Đã resize {image_key} từ {source_bucket} sang {target_bucket}")
