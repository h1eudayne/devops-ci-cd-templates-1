import boto3

# Khởi tạo client kết nối tới dịch vụ EC2
ec2_client = boto3.client('ec2')

def lambda_handler(event, context):
    # Lấy hành động mong muốn từ payload Event truyền vào (mặc định là stop)
    action = event.get('action', 'stop')
    
    # Định nghĩa bộ lọc: chỉ tìm các EC2 Instance có Tag Key là "Env" và Value là "Dev"
    filters = [
        {
            'Name': 'tag:Env',
            'Values': ['Dev']
        }
    ]
    
    # 1. Tìm kiếm các instances thỏa mãn bộ lọc
    response = ec2_client.describe_instances(Filters=filters)
    instance_ids = []
    
    for reservation in response['Reservations']:
        for instance in reservation['Instances']:
            instance_ids.append(instance['InstanceId'])
            
    if not instance_ids:
        print("Không tìm thấy EC2 Instance nào có tag Env: Dev")
        return {
            'statusCode': 200,
            'body': "No instances found with tag Env: Dev"
        }
    
    # 2. Thực thi hành động Bật hoặc Tắt tương ứng
    if action == 'start':
        ec2_client.start_instances(InstanceIds=instance_ids)
        message = f"Đã gửi lệnh START tới cụm máy chủ: {instance_ids}"
    elif action == 'stop':
        ec2_client.stop_instances(InstanceIds=instance_ids)
        message = f"Đã gửi lệnh STOP tới cụm máy chủ: {instance_ids}"
    else:
        message = f"Hành động '{action}' không hợp lệ."
        
    print(message)
    return {
        'statusCode': 200,
        'body': message
    }
