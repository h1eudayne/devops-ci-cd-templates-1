# GCP Pipeline Templates

Thu muc nay chua cac CI/CD pipeline template de deploy ung dung len cac dich vu GCP nhu GKE, Cloud Run, va push image len Artifact Registry. Cac template duoc thiet ke de co the tai su dung cho nhieu project, chi can thay doi cac bien (variable) theo tung moi truong.

---

## Noi dung chinh

### 1. Pipeline cho GitHub Actions deploy len GKE/Cloud Run

Cac workflow `.yml` de tich hop voi GitHub Actions, thuc hien:

- Build Docker image va push len Artifact Registry.
- Deploy len GKE bang `kubectl apply` hoac Helm chart.
- Deploy len Cloud Run bang `gcloud run deploy`.
- Ho tro Workload Identity Federation de xac thuc voi GCP ma khong can service account key.

**File mau:**

| File | Mo ta |
|------|-------|
| `github-actions-gke-deploy.yml` | Build, push Artifact Registry, deploy len GKE bang kubectl/Helm |
| `github-actions-cloud-run-deploy.yml` | Build, push Artifact Registry, deploy len Cloud Run |
| `github-actions-artifact-registry-push.yml` | Chi build va push image len Artifact Registry |

### 2. Pipeline cho GitLab CI push image len Artifact Registry

Cac file `.gitlab-ci.yml` template de:

- Build Docker image trong GitLab Runner.
- Login va push image len GCP Artifact Registry.
- Trigger deploy len GKE/Cloud Run tu GitLab CI.
- Ho tro Workload Identity Federation cho GitLab CI.

**File mau:**

| File | Mo ta |
|------|-------|
| `gitlab-ci-artifact-registry-push.yml` | Build va push image len Artifact Registry |
| `gitlab-ci-gke-deploy.yml` | Push image + deploy len GKE |
| `gitlab-ci-cloud-run-deploy.yml` | Push image + deploy len Cloud Run |

### 3. Cloud Build / Cloud Deploy Templates

Template cho bo CI/CD native cua GCP:

- **`cloudbuild.yaml`**: File cau hinh cho Cloud Build, dinh nghia cac step (build, test, push, deploy).
- **Cloud Deploy delivery pipeline**: Cau hinh pipeline voi cac target (dev, staging, prod) va chien luoc rollout.
- **Trigger**: Cau hinh Cloud Build trigger ket noi voi GitHub, GitLab hoac Cloud Source Repositories.

**File mau:**

| File | Mo ta |
|------|-------|
| `cloudbuild-docker.yaml` | Cloud Build: build Docker image va push len Artifact Registry |
| `cloudbuild-maven.yaml` | Cloud Build: build Java app bang Maven, chay test |
| `cloudbuild-gke-deploy.yaml` | Cloud Build: build, push va deploy len GKE |
| `cloud-deploy-pipeline.yaml` | Cloud Deploy: delivery pipeline cho GKE (dev → staging → prod) |
| `cloud-deploy-cloud-run.yaml` | Cloud Deploy: delivery pipeline cho Cloud Run |

---

## Cau truc khuyen nghi

```text
cloud/gcp/pipelines/
  github-actions/
    github-actions-gke-deploy.yml
    github-actions-cloud-run-deploy.yml
    github-actions-artifact-registry-push.yml
  gitlab-ci/
    gitlab-ci-artifact-registry-push.yml
    gitlab-ci-gke-deploy.yml
    gitlab-ci-cloud-run-deploy.yml
  cloud-build/
    cloudbuild-docker.yaml
    cloudbuild-maven.yaml
    cloudbuild-gke-deploy.yaml
  cloud-deploy/
    cloud-deploy-pipeline.yaml
    cloud-deploy-cloud-run.yaml
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
| `ci-tool` | Tool CI/CD dang su dung | `github-actions`, `gitlab-ci`, `cloudbuild`, `cloud-deploy` |
| `cloud-service` | Dich vu GCP target | `gke`, `cloud-run`, `artifact-registry` |
| `action` | Hanh dong chinh cua pipeline | `deploy`, `push`, `build` |

**Luu y ve extension:**

- GitHub Actions va GitLab CI: su dung `.yml`
- Cloud Build: su dung `.yaml` (theo convention cua GCP)
- Cloud Deploy: su dung `.yaml`

**Vi du ten file:**

- `github-actions-gke-deploy.yml` — GitHub Actions deploy len GKE
- `gitlab-ci-artifact-registry-push.yml` — GitLab CI push image len Artifact Registry
- `cloudbuild-docker.yaml` — Cloud Build cho Docker build
- `cloud-deploy-pipeline.yaml` — Cloud Deploy delivery pipeline

---

## Bien can thay doi

Khi su dung cac template, thay doi cac bien sau cho phu hop voi project:

| Bien | Mo ta | Vi du |
|------|-------|-------|
| `GCP_PROJECT_ID` | Project ID tren GCP | `my-project-123` |
| `GCP_REGION` | Region cua GCP | `asia-southeast1` |
| `AR_REPOSITORY` | Ten repository tren Artifact Registry | `my-repo` |
| `GKE_CLUSTER_NAME` | Ten cluster GKE | `my-cluster` |
| `CLOUD_RUN_SERVICE` | Ten service Cloud Run | `my-service` |
| `WORKLOAD_IDENTITY_PROVIDER` | Provider cho Workload Identity Federation | `projects/123/locations/global/workloadIdentityPools/my-pool/providers/my-provider` |
| `SERVICE_ACCOUNT` | Service account email | `my-sa@my-project.iam.gserviceaccount.com` |
| `ENVIRONMENT` | Moi truong deploy | `dev`, `staging`, `prod` |

---

## Luu y

- Uu tien su dung **Workload Identity Federation** cho GitHub Actions va GitLab CI de khong can export service account key JSON.
- Tat ca secret phai duoc luu trong CI/CD secret management (GitHub Secrets, GitLab CI Variables), **khong** hardcode trong file.
- Voi Cloud Build, service account mac dinh la `<PROJECT_NUMBER>@cloudbuild.gserviceaccount.com` — can cap quyen phu hop.
- Tham khao thu muc `cloud/gcp/services/` de hieu ro tung dich vu GCP duoc su dung trong pipeline.
