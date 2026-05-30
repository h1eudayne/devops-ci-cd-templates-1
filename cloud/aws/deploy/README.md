# AWS Pipeline Templates

Thu muc nay chua cac CI/CD pipeline template de deploy ung dung len cac dich vu AWS nhu EKS, ECS, va push image len ECR. Cac template duoc thiet ke de co the tai su dung cho nhieu project, chi can thay doi cac bien (variable) theo tung moi truong.

---

## Noi dung chinh

### 1. Pipeline cho GitHub Actions deploy len EKS/ECS

Cac workflow `.yml` de tich hop voi GitHub Actions, thuc hien:

- Build Docker image va push len ECR.
- Deploy len EKS bang `kubectl apply` hoac Helm chart.
- Deploy len ECS bang `aws ecs update-service` hoac task definition moi.
- Ho tro multi-environment (dev, staging, production) qua GitHub Environments.

**File mau:**

| File | Mo ta |
|------|-------|
| `github-actions-eks-deploy.yml` | Build, push ECR, deploy len EKS bang kubectl/Helm |
| `github-actions-ecs-deploy.yml` | Build, push ECR, update ECS service |
| `github-actions-ecr-push.yml` | Chi build va push image len ECR |

### 2. Pipeline cho GitLab CI push image len ECR

Cac file `.gitlab-ci.yml` template de:

- Build Docker image trong GitLab Runner.
- Login va push image len AWS ECR.
- Trigger deploy len EKS/ECS tu GitLab CI.

**File mau:**

| File | Mo ta |
|------|-------|
| `gitlab-ci-ecr-push.yml` | Build va push image len ECR |
| `gitlab-ci-eks-deploy.yml` | Push image + deploy len EKS |
| `gitlab-ci-ecs-deploy.yml` | Push image + update ECS service |

### 3. CodePipeline / CodeBuild Templates

Template cho bo CI/CD native cua AWS:

- **`buildspec.yml`**: File cau hinh cho CodeBuild, dinh nghia cac phase (install, pre_build, build, post_build).
- **CodePipeline definition**: Cau hinh pipeline voi cac stage Source → Build → Deploy.
- **CodeDeploy `appspec.yml`**: Dinh nghia cach deploy len EC2 hoac ECS (blue/green).

**File mau:**

| File | Mo ta |
|------|-------|
| `buildspec-docker.yml` | CodeBuild: build Docker image va push len ECR |
| `buildspec-maven.yml` | CodeBuild: build Java app bang Maven, chay test |
| `appspec-ecs-blue-green.yml` | CodeDeploy: blue/green deployment cho ECS |
| `codepipeline-eks.json` | CodePipeline definition: GitHub → CodeBuild → EKS |

---

## Cau truc khuyen nghi

```text
cloud/aws/deploy/
  github-actions/
    github-actions-eks-deploy.yml
    github-actions-ecs-deploy.yml
    github-actions-ecr-push.yml
  gitlab-ci/
    gitlab-ci-ecr-push.yml
    gitlab-ci-eks-deploy.yml
    gitlab-ci-ecs-deploy.yml
  codepipeline/
    buildspec-docker.yml
    buildspec-maven.yml
    appspec-ecs-blue-green.yml
    codepipeline-eks.json
  README.md
```

---

## Quy tac dat ten file

Moi file pipeline nen duoc dat ten theo format:

```
<ci-tool>-<cloud-service>-<action>.yml
```

**Giai thich:**

| Thanh phan | Giai thich | Vi du |
|-----------|------------|-------|
| `ci-tool` | Tool CI/CD dang su dung | `github-actions`, `gitlab-ci`, `codepipeline`, `buildspec` |
| `cloud-service` | Dich vu AWS target | `eks`, `ecs`, `ecr`, `s3` |
| `action` | Hanh dong chinh cua pipeline | `deploy`, `push`, `build`, `blue-green` |

**Vi du ten file:**

- `github-actions-eks-deploy.yml` — GitHub Actions deploy len EKS
- `gitlab-ci-ecr-push.yml` — GitLab CI push image len ECR
- `buildspec-docker.yml` — CodeBuild buildspec cho Docker build
- `appspec-ecs-blue-green.yml` — CodeDeploy appspec cho ECS blue/green

---

## Bien can thay doi

Khi su dung cac template, thay doi cac bien sau cho phu hop voi project:

| Bien | Mo ta | Vi du |
|------|-------|-------|
| `AWS_REGION` | Region cua AWS | `ap-southeast-1` |
| `AWS_ACCOUNT_ID` | Account ID cua AWS | `123456789012` |
| `ECR_REPOSITORY` | Ten repository tren ECR | `my-app` |
| `EKS_CLUSTER_NAME` | Ten cluster EKS | `my-cluster` |
| `ECS_SERVICE_NAME` | Ten service ECS | `my-service` |
| `ECS_CLUSTER_NAME` | Ten cluster ECS | `my-ecs-cluster` |
| `ENVIRONMENT` | Moi truong deploy | `dev`, `staging`, `prod` |

---

## Luu y

- Tat ca secret (AWS Access Key, Secret Key) phai duoc luu trong CI/CD secret management (GitHub Secrets, GitLab CI Variables), **khong** hardcode trong file.
- Uu tien su dung OIDC / IAM Role thay vi Access Key khi co the (GitHub Actions ho tro OIDC voi AWS).
- Kiem tra ky quyen IAM cua role/user dung trong pipeline de dam bao nguyen tac least privilege.
- Tham khao thu muc `cloud/aws/services/` de hieu ro tung dich vu AWS duoc su dung trong pipeline.
