# AWS Templates

Thư mục này chứa các tài nguyên liên quan đến Amazon Web Services (AWS) cho DevOps.

## Cấu trúc

```text
aws/
├── services/        # Giới thiệu các dịch vụ AWS + hướng dẫn sử dụng
│   └── README.md
├── deploy/          # Cấu hình deploy lên AWS
│   └── README.md
├── templates/       # Mẫu cấu hình JSON/YAML cho các dịch vụ (S3, IAM)
└── README.md        # (file này)
```

| Thư mục | Mô tả | Khi nào vào? |
| --- | --- | --- |
| `services/` | Giải thích từng dịch vụ AWS là gì, khi nào dùng, cách bắt đầu | "Tôi chưa biết EKS/ECS/ECR là gì" |
| `deploy/` | Cấu hình và hướng dẫn deploy ứng dụng lên AWS | "Tôi cần file config deploy lên EKS/ECR" |
| `templates/` | Mẫu cấu hình JSON/YAML phục vụ phân quyền và quản lý tài nguyên | "Tôi cần tìm các file JSON mẫu cho S3 Bucket Policy hoặc IAM Policy" |

## Các dịch vụ AWS chính

| Nhóm | Dịch vụ | Mô tả ngắn |
| --- | --- | --- |
| Compute | EKS | Dịch vụ Kubernetes quản lý (Managed Kubernetes) |
| Compute | ECS | Điều phối Container (Container Orchestration) |
| Registry | ECR | Kho lưu trữ Docker image (Docker Image Registry) |
| Database | RDS | Cơ sở dữ liệu quan hệ được quản lý (Managed SQL) |
| Storage | S3 | Lưu trữ đối tượng (Object Storage) |
| Storage | EFS | Lưu trữ tệp dùng chung (Shared Filesystem) |
| Network | VPC | Mạng riêng ảo (Virtual Private Cloud) |
| Network | ELB & Auto Scaling | Cân bằng tải & Co giãn tự động |
| Security | IAM | Quản lý định danh & truy cập (IAM) |
| TLS | ACM | Quản lý chứng chỉ bảo mật (Certificate Manager) |
| CI/CD | CodePipeline | Bộ công cụ CI/CD nguyên bản của AWS |
| DNS | Route 53 | Hệ thống phân giải tên miền (DNS) |
| CDN | CloudFront | Mạng phân phối nội dung (CDN) |

## Lưu ý

- Không commit AWS Access Key, Secret Key, hoặc bất kỳ thông tin xác thực nào.
- Ưu tiên sử dụng Terraform module hoặc CloudFormation để tái sử dụng.
- Tất cả template nên sử dụng biến (variable) cho region, account ID, tên resource.
