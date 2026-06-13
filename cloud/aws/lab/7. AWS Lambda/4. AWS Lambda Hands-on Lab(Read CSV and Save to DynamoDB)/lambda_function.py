import boto3
import csv
import codecs

# Khởi tạo clients kết nối S3 và DynamoDB
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Students')

def lambda_handler(event, context):
    for record in event['Records']:
        # Lấy thông tin bucket và key của file tải lên
        bucket = record['s3']['bucket']['name']
        csv_key = record['s3']['object']['key']
        
        # 1. Gọi S3 API lấy dữ liệu tệp tin dưới dạng stream body
        response = s3_client.get_object(Bucket=bucket, Key=csv_key)
        
        # 2. Sử dụng codecs và csv.DictReader để phân tích file CSV
        # DictReader tự động map dòng đầu tiên làm Header (Key) của Object
        csv_reader = csv.DictReader(codecs.getreader("utf-8")(response['Body']))
        
        row_count = 0
        for row in csv_reader:
            student_id = row.get('student_id')
            name = row.get('name')
            age = row.get('age')
            class_name = row.get('class')
            
            # Kiểm tra trường bắt buộc partition key
            if not student_id:
                continue
            
            # 3. Ghi dữ liệu vào bảng DynamoDB
            table.put_item(
                Item={
                    'student_id': student_id,
                    'name': name,
                    'age': int(age) if age else 0, # Ép kiểu số nguyên cho DynamoDB
                    'class': class_name
                }
            )
            row_count += 1
            
        print(f"Thành công! Đã đọc file {csv_key} từ {bucket}. Đã lưu {row_count} bản ghi vào bảng Students.")
        
    return {
        'statusCode': 200,
        'body': f"Successfully processed CSV and loaded {row_count} items into DynamoDB."
    }
