# AWS Services cho DevOps / CI-CD

Thư mục này mô tả các dịch vụ AWS thường được sử dụng trong quy trình DevOps và CI/CD. Mỗi dịch vụ được trình bày với tên, mô tả ngắn, trường hợp sử dụng và hướng dẫn cơ bản để bắt đầu.

---

## Mục lục

| # | Dịch vụ | Mô tả ngắn |
|---|---------|------------|
| 01 | [EC2 (Amazon Elastic Compute Cloud)](1. EC2/1. Amazon EC2.md) | Virtual server (Máy chủ ảo) |
| 02 | [IAM (Identity & Access Management)](2. IAM/1. Amazon IAM.md) | Identity & access management |
| 03 | [S3 (Amazon Simple Storage Service)](3. S3/1. Amazon S3.md) | Object storage |
| 04 | [ELB & Auto Scaling (Cân bằng tải & Co giãn)](4. ELB/1. Amazon ELB.md) | Bộ cân bằng tải và Co giãn tự động |
| 05 | [EKS (Elastic Kubernetes Service)](5. EKS.md) | Managed Kubernetes |
| 06 | [ECS (Elastic Container Service)](6. ECS.md) | Container orchestration |
| 07 | [ECR (Elastic Container Registry)](7. ECR.md) | Docker image registry |
| 08 | [RDS (Relational Database Service)](8. RDS.md) | Managed database |
| 09 | [VPC (Virtual Private Cloud)](9. VPC.md) | Virtual network |
| 10 | [CodePipeline / CodeBuild / CodeDeploy](10. CodePipeline.md) | CI/CD native AWS |
| 11 | [Route 53](11. Route 53.md) | DNS |
| 12 | [CloudFront](12. CloudFront.md) | CDN |
| 13 | [ACM (Certificate Manager)](13. ACM.md) | TLS certificates |
| 14 | [EFS (Elastic File System)](14. EFS.md) | Shared file storage |

---

## Lưu ý chung

- Tất cả các dịch vụ trên nên được cấu hình bằng IaC (Terraform, CloudFormation) để đảm bảo reproducibility.
- Không commit AWS Access Key, Secret Key, hoặc bất kỳ thông tin xác thực nào vào repository.
- Ưu tiên sử dụng IAM Role thay vì Access Key khi có thể.
- Tham khảo thư mục `cloud/aws/deploy/` để xem các deploy template tích hợp với các dịch vụ này.
