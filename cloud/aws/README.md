# AWS Templates

Thu muc nay chua cac tai nguyen lien quan den Amazon Web Services (AWS) cho DevOps.

## Cau truc

```text
aws/
├── services/        # 📖 Gioi thieu cac dich vu AWS + huong dan su dung
│   └── README.md
├── pipelines/       # 🚀 Pipeline templates deploy len AWS
│   └── README.md
└── README.md        # (file nay)
```

| Folder | Mo ta | Khi nao vao? |
| --- | --- | --- |
| `services/` | Giai thich tung dich vu AWS la gi, khi nao dung, cach bat dau | "Toi chua biet EKS/ECS/ECR la gi" |
| `pipelines/` | File pipeline CI/CD de deploy ung dung len AWS | "Toi can file .yml deploy len EKS/ECR" |

## Cac dich vu AWS chinh

| Nhom | Dich vu | Mo ta ngan |
| --- | --- | --- |
| Compute | EKS | Managed Kubernetes |
| Compute | ECS | Container orchestration |
| Registry | ECR | Docker image registry |
| Database | RDS | Managed relational database |
| Storage | S3 | Object storage |
| Storage | EFS | Shared file system |
| Network | VPC | Virtual private network |
| Security | IAM | Identity & access management |
| TLS | ACM | Certificate manager |
| CI/CD | CodePipeline | Native AWS CI/CD |
| DNS | Route 53 | Domain name service |
| CDN | CloudFront | Content delivery network |

## Luu y

- Khong commit AWS Access Key, Secret Key, hoac bat ky thong tin xac thuc nao.
- Uu tien su dung Terraform module hoac CloudFormation de tai su dung.
- Tat ca template nen su dung bien (variable) cho region, account ID, ten resource.
