# GCP Services cho DevOps / CI-CD

Thu muc nay mo ta cac dich vu Google Cloud Platform (GCP) thuong duoc su dung trong quy trinh DevOps va CI/CD. Moi dich vu duoc trinh bay voi ten, mo ta ngan, truong hop su dung va huong dan co ban de bat dau.

---

## Muc luc

| # | Dich vu | Mo ta ngan |
|---|---------|------------|
| 1 | [GKE](#1-gke---google-kubernetes-engine) | Managed Kubernetes |
| 2 | [Cloud Run](#2-cloud-run) | Serverless containers |
| 3 | [Artifact Registry](#3-artifact-registry) | Container/package registry |
| 4 | [Cloud SQL](#4-cloud-sql) | Managed database |
| 5 | [Cloud Storage](#5-cloud-storage) | Object storage (GCS) |
| 6 | [VPC](#6-vpc---virtual-private-cloud) | Virtual network |
| 7 | [IAM & Workload Identity](#7-iam--workload-identity) | Identity management |
| 8 | [Cloud Build / Cloud Deploy](#8-cloud-build--cloud-deploy) | CI/CD native GCP |
| 9 | [Cloud DNS](#9-cloud-dns) | DNS |
| 10 | [Cloud CDN](#10-cloud-cdn) | CDN |
| 11 | [Cloud Load Balancing](#11-cloud-load-balancing) | Load balancer |
| 12 | [Secret Manager](#12-secret-manager) | Secrets management |

---

## 1. GKE - Google Kubernetes Engine

**No la gi:**
GKE la dich vu Kubernetes duoc quan ly boi Google Cloud. GCP lo phan control plane, ban chi can quan ly node pool hoac su dung che do Autopilot de GCP tu dong quan ly toan bo infra. GKE co hai che do: **Standard** (ban quan ly node pool) va **Autopilot** (GCP tu dong scale va quan ly node).

**Khi nao su dung:**
- Khi can chay ung dung container hoa tren Kubernetes voi managed control plane.
- Khi muon su dung Autopilot de giam thieu cong viec van hanh — GCP tu dong quan ly node.
- Khi can tich hop sau voi cac dich vu GCP nhu Cloud SQL, Secret Manager, Cloud Build.

**Huong dan co ban:**
1. Cai dat `gcloud` CLI va `kubectl`.
2. Tao cluster: `gcloud container clusters create my-cluster --region asia-southeast1 --num-nodes 2 --machine-type e2-medium` (Standard) hoac them `--enable-autopilot` (Autopilot).
3. Lay kubeconfig: `gcloud container clusters get-credentials my-cluster --region asia-southeast1`.
4. Kiem tra cluster: `kubectl get nodes`.
5. Deploy ung dung: `kubectl apply -f deployment.yaml`.

---

## 2. Cloud Run

**No la gi:**
Cloud Run la dich vu serverless cho phep chay container ma khong can quan ly infra. Ban chi can cung cap Docker image, Cloud Run se tu dong scale (bao gom scale to zero khi khong co traffic). Cloud Run tinh phi theo thoi gian request duoc xu ly, rat phu hop cho microservice va API.

**Khi nao su dung:**
- Khi can deploy nhanh mot API hoac web service ma khong muon quan ly server/cluster.
- Khi workload co traffic khong deu va can tu dong scale to zero de tiet kiem chi phi.
- Khi muon deploy nhanh tu container image ma khong can cau hinh Kubernetes.

**Huong dan co ban:**
1. Build va push image len Artifact Registry.
2. Deploy len Cloud Run: `gcloud run deploy my-service --image asia-southeast1-docker.pkg.dev/PROJECT/REPO/IMAGE:TAG --region asia-southeast1 --allow-unauthenticated`.
3. Cloud Run se tra ve URL de truy cap service.
4. Cau hinh custom domain (neu can) qua Cloud Run domain mapping.
5. Cau hinh environment variable va secret mount cho service.

---

## 3. Artifact Registry

**No la gi:**
Artifact Registry la dich vu registry cua GCP de luu tru Docker image, Maven/Gradle package, npm package, Python package va nhieu loai artifact khac. Day la phien ban ke nhiem cua Container Registry (gcr.io) voi nhieu tinh nang hon nhu multi-format, cleanup policy va IAM chi tiet.

**Khi nao su dung:**
- Khi can private Docker registry tren GCP de luu image cho pipeline CI/CD.
- Khi can luu tru ca Docker image lan language package (Maven, npm, Python) trong cung mot dich vu.
- Khi can cleanup policy de tu dong xoa image/package cu.

**Huong dan co ban:**
1. Tao repository: `gcloud artifacts repositories create my-repo --repository-format=docker --location=asia-southeast1`.
2. Cau hinh Docker auth: `gcloud auth configure-docker asia-southeast1-docker.pkg.dev`.
3. Build va tag image: `docker build -t asia-southeast1-docker.pkg.dev/PROJECT/my-repo/my-app:latest .`.
4. Push image: `docker push asia-southeast1-docker.pkg.dev/PROJECT/my-repo/my-app:latest`.
5. Cau hinh cleanup policy de tu dong xoa image cu hon N ngay.

---

## 4. Cloud SQL

**No la gi:**
Cloud SQL la dich vu database quan ly cua GCP, ho tro MySQL, PostgreSQL va SQL Server. GCP lo cac cong viec nhu patching, backup, replication, failover. Cloud SQL ho tro high availability voi regional instance, read replica va automatic backup.

**Khi nao su dung:**
- Khi ung dung can relational database ma khong muon tu quan ly database server.
- Khi can automated backup, point-in-time recovery va high availability.
- Khi can ket noi an toan tu GKE hoac Cloud Run den database qua Cloud SQL Auth Proxy.

**Huong dan co ban:**
1. Tao Cloud SQL instance: `gcloud sql instances create my-db --database-version=POSTGRES_15 --tier=db-custom-2-8192 --region=asia-southeast1`.
2. Tao database va user.
3. Cau hinh private IP (neu muon ket noi tu VPC) hoac su dung Cloud SQL Auth Proxy.
4. Voi GKE: deploy Cloud SQL Auth Proxy dang sidecar container trong pod.
5. Luu connection string va password trong Secret Manager, khong hardcode trong code.

---

## 5. Cloud Storage

**No la gi:**
Cloud Storage (GCS) la dich vu object storage cua GCP voi do ben (durability) 99.999999999%. GCS cho phep luu tru bat ky loai file nao voi nhieu storage class (Standard, Nearline, Coldline, Archive) de toi uu chi phi. GCS duoc su dung rong rai cho backup, static hosting, Terraform state va artifact storage.

**Khi nao su dung:**
- Khi can luu tru artifact tu pipeline CI/CD (build output, Helm chart, config file).
- Khi can backend cho Terraform remote state.
- Khi can luu tru backup, log file hoac static asset.

**Huong dan co ban:**
1. Tao bucket: `gsutil mb -l asia-southeast1 gs://my-project-artifacts`.
2. Bat versioning: `gsutil versioning set on gs://my-project-artifacts`.
3. Cau hinh lifecycle rule de chuyen object cu sang Nearline/Coldline hoac xoa sau N ngay.
4. Cau hinh IAM binding de gioi han quyen truy cap bucket.
5. Su dung cho Terraform backend: cau hinh `backend "gcs"` trong file Terraform.

---

## 6. VPC - Virtual Private Cloud

**No la gi:**
VPC la mang ao rieng tren GCP, cho phep ban dinh nghia subnet, firewall rule va kiem soat luu luong mang. GCP VPC la global resource (khong gioi han trong mot region), subnet moi la regional. Moi tai nguyen GCP (GKE, Cloud SQL, Compute Engine) deu chay trong mot VPC.

**Khi nao su dung:**
- Bat buoc khi trien khai bat ky tai nguyen nao tren GCP.
- Khi can tach biet moi truong (dev, staging, production) bang cac VPC rieng hoac shared VPC.
- Khi can ket noi on-premise voi GCP qua Cloud VPN hoac Cloud Interconnect.

**Huong dan co ban:**
1. Tao VPC: `gcloud compute networks create my-vpc --subnet-mode=custom`.
2. Tao subnet: `gcloud compute networks subnets create my-subnet --network=my-vpc --region=asia-southeast1 --range=10.0.0.0/24`.
3. Tao firewall rule cho phep traffic can thiet (SSH, HTTP, HTTPS, internal).
4. Cau hinh Cloud NAT de instance trong private subnet co the truy cap internet.
5. Cau hinh Cloud Router cho Cloud NAT va VPN.

---

## 7. IAM & Workload Identity

**No la gi:**
IAM tren GCP quan ly quyen truy cap cho user, group va service account. **Workload Identity** la co che cho phep pod tren GKE su dung GCP service account ma khong can export key JSON. Day la cach an toan nhat de pod truy cap cac dich vu GCP nhu Cloud SQL, Secret Manager, Cloud Storage.

**Khi nao su dung:**
- Khi can cap quyen cho pipeline CI/CD de push image, deploy len GKE/Cloud Run.
- Khi can cau hinh Workload Identity cho pod tren GKE truy cap dich vu GCP.
- Khi can cau hinh Workload Identity Federation cho CI/CD tu ben ngoai (GitHub Actions, GitLab CI) truy cap GCP ma khong can service account key.

**Huong dan co ban:**
1. Tao service account: `gcloud iam service-accounts create my-sa --display-name="My Service Account"`.
2. Gan role cho service account: `gcloud projects add-iam-policy-binding PROJECT --member="serviceAccount:my-sa@PROJECT.iam.gserviceaccount.com" --role="roles/container.developer"`.
3. Cau hinh Workload Identity cho GKE: lien ket Kubernetes Service Account voi GCP Service Account.
4. Cau hinh Workload Identity Federation: tao pool va provider cho GitHub Actions/GitLab CI.
5. Ap dung nguyen tac least privilege — chi cap dung role can thiet.

---

## 8. Cloud Build / Cloud Deploy

**No la gi:**
**Cloud Build** la dich vu CI serverless cua GCP, chay cac buoc build/test/push dua tren file `cloudbuild.yaml`. **Cloud Deploy** la dich vu CD de quan ly delivery pipeline, ho tro progressive rollout (canary, rolling) len GKE va Cloud Run. Hai dich vu nay ket hop tao thanh bo CI/CD native cua GCP.

**Khi nao su dung:**
- Khi muon xay dung pipeline CI/CD hoan toan tren GCP ma khong can tool ben ngoai.
- Khi can serverless build — khong can quan ly build server.
- Khi can progressive delivery (canary, rolling) cho GKE hoac Cloud Run.

**Huong dan co ban:**
1. Tao file `cloudbuild.yaml` dinh nghia cac step: build image, push len Artifact Registry, chay test.
2. Tao Cloud Build trigger ket noi voi GitHub/GitLab/Cloud Source Repositories.
3. Cau hinh Cloud Deploy delivery pipeline voi cac target (dev, staging, prod).
4. Tao release trong Cloud Deploy de trigger deployment.
5. Cau hinh IAM role cho Cloud Build service account voi quyen phu hop.

---

## 9. Cloud DNS

**No la gi:**
Cloud DNS la dich vu DNS cua GCP, cho phep quan ly DNS zone va record voi do tin cay cao (100% SLA). Cloud DNS ho tro public zone (internet-facing) va private zone (chi trong VPC). No tich hop voi cac dich vu GCP khac de tao record tro ve Load Balancer, Cloud Run, GKE Ingress.

**Khi nao su dung:**
- Khi can quan ly DNS cho ung dung deploy tren GCP.
- Khi can tao record tro ve Cloud Load Balancer, Cloud Run URL hoac GKE Ingress IP.
- Khi can private DNS zone cho internal service discovery trong VPC.

**Huong dan co ban:**
1. Tao DNS zone: `gcloud dns managed-zones create my-zone --dns-name="myapp.com." --description="My App DNS"`.
2. Cap nhat nameserver tai nha dang ky domain tro ve Cloud DNS nameserver.
3. Tao A record tro ve Load Balancer IP: `gcloud dns record-sets create myapp.com. --zone=my-zone --type=A --ttl=300 --rrdatas="<LB-IP>"`.
4. Tao CNAME cho subdomain: `gcloud dns record-sets create api.myapp.com. --zone=my-zone --type=CNAME --ttl=300 --rrdatas="myapp.com."`.
5. Su dung private zone cho internal DNS trong VPC.

---

## 10. Cloud CDN

**No la gi:**
Cloud CDN la dich vu CDN cua GCP, cache noi dung tai cac edge location tren toan cau de giam latency. Cloud CDN hoat dong cung voi Cloud Load Balancing — ban bat CDN tren backend service cua HTTP(S) Load Balancer. No ho tro cache static content, dynamic content va signed URL/cookie.

**Khi nao su dung:**
- Khi can phan phoi static asset (JS, CSS, image) nhanh cho nguoi dung toan cau.
- Khi muon cache response tu backend de giam tai server.
- Khi da su dung Cloud Load Balancing va muon them CDN de tang hieu suat.

**Huong dan co ban:**
1. Tao HTTP(S) Load Balancer voi backend service (GKE, Cloud Run, GCS bucket).
2. Bat Cloud CDN tren backend service: `gcloud compute backend-services update my-backend --enable-cdn`.
3. Cau hinh cache policy: TTL, cache mode (CACHE_ALL_STATIC, USE_ORIGIN_HEADERS, FORCE_CACHE_ALL).
4. Cau hinh signed URL/cookie neu can bao ve noi dung (video, file download).
5. Su dung `Cache-Control` header trong ung dung de kiem soat cache behavior.

---

## 11. Cloud Load Balancing

**No la gi:**
Cloud Load Balancing la dich vu load balancer cua GCP, phan phoi traffic den cac backend tren nhieu region. GCP cung cap nhieu loai: HTTP(S) Load Balancer (L7), TCP/UDP Load Balancer (L4), Internal Load Balancer. Cloud Load Balancing la global resource, ho tro anycast IP va tich hop voi Cloud CDN, Cloud Armor.

**Khi nao su dung:**
- Khi can phan phoi traffic den GKE, Cloud Run hoac instance group.
- Khi can global load balancing voi mot IP duy nhat cho nhieu region.
- Khi can tich hop voi Cloud CDN, Cloud Armor (WAF/DDoS protection) va SSL certificate.

**Huong dan co ban:**
1. Tao backend service voi health check.
2. Tao URL map va target HTTP(S) proxy.
3. Tao forwarding rule voi global IP: `gcloud compute addresses create my-ip --global`.
4. Gan SSL certificate (tu Google-managed hoac tu upload).
5. Cau hinh Cloud Armor security policy neu can WAF/DDoS protection.

---

## 12. Secret Manager

**No la gi:**
Secret Manager la dich vu quan ly secret cua GCP, cho phep luu tru va truy cap API key, password, certificate va cac thong tin nhay cam khac mot cach an toan. Secret Manager ho tro versioning, IAM access control va audit logging. Pod tren GKE co the mount secret truc tiep qua CSI driver.

**Khi nao su dung:**
- Khi can luu tru database password, API key, certificate cho ung dung.
- Khi can cung cap secret cho pod tren GKE hoac Cloud Run service.
- Khi muon versioning va audit log cho viec truy cap secret.

**Huong dan co ban:**
1. Tao secret: `gcloud secrets create my-db-password --replication-policy="automatic"`.
2. Them version (gia tri) cho secret: `echo -n "my-password" | gcloud secrets versions add my-db-password --data-file=-`.
3. Truy cap secret: `gcloud secrets versions access latest --secret=my-db-password`.
4. Cau hinh IAM de chi cho phep service account can thiet truy cap secret.
5. Voi GKE: cai dat Secret Store CSI Driver va mount secret vao pod.

---

## Luu y chung

- Tat ca cac dich vu tren nen duoc cau hinh bang IaC (Terraform) de dam bao reproducibility.
- Khong commit service account key JSON, OAuth token hoac bat ky thong tin xac thuc nao vao repository.
- Uu tien su dung Workload Identity thay vi export service account key.
- Tham khao thu muc `cloud/gcp/pipelines/` de xem cac pipeline template tich hop voi cac dich vu nay.
