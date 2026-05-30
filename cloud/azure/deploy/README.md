# Azure Pipeline Templates

Thu muc nay chua cac CI/CD pipeline template de deploy ung dung len cac dich vu Azure nhu AKS, va push image len ACR. Cac template duoc thiet ke de co the tai su dung cho nhieu project, chi can thay doi cac bien (variable) theo tung moi truong.

---

## Noi dung chinh

### 1. Pipeline cho GitHub Actions deploy len AKS

Cac workflow `.yml` de tich hop voi GitHub Actions, thuc hien:

- Build Docker image va push len ACR.
- Deploy len AKS bang `kubectl apply` hoac Helm chart.
- Ho tro Azure Login bang service principal hoac Federated Credential (OIDC).
- Ho tro multi-environment (dev, staging, production) qua GitHub Environments.

**File mau:**

| File | Mo ta |
|------|-------|
| `github-actions-aks-deploy.yml` | Build, push ACR, deploy len AKS bang kubectl/Helm |
| `github-actions-acr-push.yml` | Chi build va push image len ACR |
| `github-actions-aks-helm.yml` | Deploy len AKS bang Helm chart voi values per environment |

### 2. Pipeline cho GitLab CI push image len ACR

Cac file `.gitlab-ci.yml` template de:

- Build Docker image trong GitLab Runner.
- Login va push image len Azure ACR.
- Trigger deploy len AKS tu GitLab CI.
- Ho tro Federated Credential cho GitLab CI (OIDC).

**File mau:**

| File | Mo ta |
|------|-------|
| `gitlab-ci-acr-push.yml` | Build va push image len ACR |
| `gitlab-ci-aks-deploy.yml` | Push image + deploy len AKS |
| `gitlab-ci-aks-helm.yml` | Push image + deploy len AKS bang Helm |

### 3. Azure DevOps Pipelines Templates (azure-pipelines.yml)

Template cho dich vu CI/CD native cua Azure:

- **`azure-pipelines.yml`**: File cau hinh multi-stage pipeline voi trigger, stage, job va task.
- **Variable Group**: Template huong dan cau hinh variable group ket noi voi Key Vault.
- **Service Connection**: Huong dan tao service connection den Azure subscription va AKS cluster.
- **Environment & Approval**: Cau hinh environment voi approval gate cho production deploy.

**File mau:**

| File | Mo ta |
|------|-------|
| `azure-pipelines-aks-deploy.yml` | Multi-stage pipeline: build, push ACR, deploy len AKS |
| `azure-pipelines-acr-push.yml` | Pipeline chi build va push image len ACR |
| `azure-pipelines-helm.yml` | Pipeline deploy len AKS bang Helm chart |
| `azure-pipelines-infra.yml` | Pipeline chay Terraform de provision ha tang Azure |

---

## Cau truc khuyen nghi

```text
cloud/azure/deploy/
  github-actions/
    github-actions-aks-deploy.yml
    github-actions-acr-push.yml
    github-actions-aks-helm.yml
  gitlab-ci/
    gitlab-ci-acr-push.yml
    gitlab-ci-aks-deploy.yml
    gitlab-ci-aks-helm.yml
  azure-devops/
    azure-pipelines-aks-deploy.yml
    azure-pipelines-acr-push.yml
    azure-pipelines-helm.yml
    azure-pipelines-infra.yml
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
| `ci-tool` | Tool CI/CD dang su dung | `github-actions`, `gitlab-ci`, `azure-pipelines` |
| `cloud-service` | Dich vu Azure target | `aks`, `acr`, `blob` |
| `action` | Hanh dong chinh cua pipeline | `deploy`, `push`, `helm`, `infra` |

**Vi du ten file:**

- `github-actions-aks-deploy.yml` — GitHub Actions deploy len AKS
- `gitlab-ci-acr-push.yml` — GitLab CI push image len ACR
- `azure-pipelines-aks-deploy.yml` — Azure DevOps multi-stage deploy len AKS
- `azure-pipelines-infra.yml` — Azure DevOps chay Terraform cho ha tang

---

## Bien can thay doi

Khi su dung cac template, thay doi cac bien sau cho phu hop voi project:

| Bien | Mo ta | Vi du |
|------|-------|-------|
| `AZURE_SUBSCRIPTION_ID` | Subscription ID cua Azure | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_RESOURCE_GROUP` | Ten resource group | `my-rg` |
| `ACR_NAME` | Ten registry ACR (khong co `.azurecr.io`) | `myacr` |
| `ACR_LOGIN_SERVER` | Login server cua ACR | `myacr.azurecr.io` |
| `AKS_CLUSTER_NAME` | Ten cluster AKS | `my-cluster` |
| `AZURE_TENANT_ID` | Tenant ID cua Azure AD | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `AZURE_CLIENT_ID` | Client ID cua service principal / app | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `ENVIRONMENT` | Moi truong deploy | `dev`, `staging`, `prod` |

---

## So sanh cac CI/CD tool

| Tieu chi | GitHub Actions | GitLab CI | Azure DevOps Pipelines |
|----------|---------------|-----------|----------------------|
| File cau hinh | `.github/workflows/*.yml` | `.gitlab-ci.yml` | `azure-pipelines.yml` |
| Runner | GitHub-hosted / self-hosted | GitLab Runner | Microsoft-hosted / self-hosted agent |
| Secret management | GitHub Secrets | CI/CD Variables | Variable Group + Key Vault |
| Azure auth | OIDC / Service Principal | OIDC / Service Principal | Service Connection |
| Approval gate | Environment protection rules | Manual job | Environment approval |
| Uu diem | Tich hop tot voi GitHub repo | Tich hop day du voi GitLab | Tich hop sau voi Azure ecosystem |

---

## Luu y

- Tat ca secret (client secret, tenant ID, subscription ID) phai duoc luu trong CI/CD secret management, **khong** hardcode trong file.
- Uu tien su dung **Federated Credential (OIDC)** cho GitHub Actions va GitLab CI de khong can luu client secret.
- Voi Azure DevOps, su dung **Service Connection** va **Variable Group lien ket Key Vault** de quan ly secret.
- Kiem tra ky quyen cua service principal / Managed Identity de dam bao nguyen tac least privilege.
- Tham khao thu muc `cloud/azure/services/` de hieu ro tung dich vu Azure duoc su dung trong pipeline.
