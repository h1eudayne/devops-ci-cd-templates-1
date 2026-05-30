# Azure Services cho DevOps / CI-CD

Thu muc nay mo ta cac dich vu Microsoft Azure thuong duoc su dung trong quy trinh DevOps va CI/CD. Moi dich vu duoc trinh bay voi ten, mo ta ngan, truong hop su dung va huong dan co ban de bat dau.

---

## Muc luc

| # | Dich vu | Mo ta ngan |
|---|---------|------------|
| 1 | [AKS](#1-aks---azure-kubernetes-service) | Managed Kubernetes |
| 2 | [ACI](#2-aci---azure-container-instances) | Serverless containers |
| 3 | [ACR](#3-acr---azure-container-registry) | Docker image registry |
| 4 | [Azure SQL](#4-azure-sql) | Managed database |
| 5 | [Blob Storage](#5-blob-storage) | Object storage |
| 6 | [VNet](#6-vnet---virtual-network) | Virtual network |
| 7 | [Azure AD / Managed Identity](#7-azure-ad--managed-identity) | Identity management |
| 8 | [Azure DevOps Pipelines](#8-azure-devops-pipelines) | CI/CD native Azure |
| 9 | [Azure DNS](#9-azure-dns) | DNS |
| 10 | [Azure CDN](#10-azure-cdn) | CDN |
| 11 | [Key Vault](#11-key-vault) | Secrets & certificates |
| 12 | [Azure Front Door](#12-azure-front-door) | Global load balancer + CDN |

---

## 1. AKS - Azure Kubernetes Service

**No la gi:**
AKS la dich vu Kubernetes duoc quan ly boi Azure. Azure lo phan control plane (mien phi), ban chi can quan ly va tra phi cho worker node. AKS tich hop sau voi Azure AD, Azure Monitor, Azure Policy va ho tro nhieu tinh nang nhu cluster autoscaler, virtual node (ACI), va Azure CNI networking.

**Khi nao su dung:**
- Khi can chay ung dung container hoa tren Kubernetes voi managed control plane.
- Khi can tich hop identity voi Azure AD va RBAC.
- Khi can tich hop voi cac dich vu Azure khac nhu ACR, Key Vault, Azure Monitor.

**Huong dan co ban:**
1. Cai dat `az` CLI va `kubectl`.
2. Tao resource group: `az group create --name my-rg --location southeastasia`.
3. Tao AKS cluster: `az aks create --resource-group my-rg --name my-cluster --node-count 2 --node-vm-size Standard_B2s --enable-managed-identity`.
4. Lay kubeconfig: `az aks get-credentials --resource-group my-rg --name my-cluster`.
5. Kiem tra cluster: `kubectl get nodes`.

---

## 2. ACI - Azure Container Instances

**No la gi:**
ACI la dich vu serverless container cua Azure, cho phep chay container ma khong can quan ly VM hoac cluster. ACI phu hop cho cac workload ngan han, batch job, hoac truong hop can khoi dong container nhanh ma khong can ha tang Kubernetes. ACI cung co the tich hop voi AKS qua Virtual Node de burst workload.

**Khi nao su dung:**
- Khi can chay container nhanh cho task ngan han (batch processing, CI/CD runner).
- Khi can burst workload tu AKS ra ACI khi cluster het capacity (Virtual Node).
- Khi ung dung don gian, khong can day du tinh nang cua Kubernetes.

**Huong dan co ban:**
1. Tao container instance: `az container create --resource-group my-rg --name my-container --image myacr.azurecr.io/my-app:latest --cpu 1 --memory 1.5 --ports 80`.
2. Kiem tra trang thai: `az container show --resource-group my-rg --name my-container`.
3. Xem log: `az container logs --resource-group my-rg --name my-container`.
4. Cau hinh environment variable va volume mount neu can.
5. Su dung container group de chay nhieu container cung nhau (tuong tu pod trong K8s).

---

## 3. ACR - Azure Container Registry

**No la gi:**
ACR la dich vu Docker container registry duoc quan ly boi Azure. ACR cho phep luu tru, quan ly va deploy Docker image. No ho tro image scanning (voi Microsoft Defender), geo-replication, ACR Tasks (automated build) va tich hop truc tiep voi AKS de pull image ma khong can cau hinh imagePullSecrets.

**Khi nao su dung:**
- Khi can private Docker registry tren Azure de luu tru image cho pipeline CI/CD.
- Khi su dung AKS va muon pull image truc tiep tu ACR bang managed identity.
- Khi can geo-replication de phan phoi image gan voi cac region deploy.

**Huong dan co ban:**
1. Tao registry: `az acr create --resource-group my-rg --name myacr --sku Basic`.
2. Login Docker: `az acr login --name myacr`.
3. Build va tag image: `docker build -t myacr.azurecr.io/my-app:latest .`.
4. Push image: `docker push myacr.azurecr.io/my-app:latest`.
5. Attach ACR voi AKS: `az aks update --resource-group my-rg --name my-cluster --attach-acr myacr`.

---

## 4. Azure SQL

**No la gi:**
Azure SQL la dich vu database quan ly cua Azure, bao gom Azure SQL Database (single database, elastic pool) va Azure SQL Managed Instance. Azure lo cac cong viec nhu patching, backup, high availability. Azure SQL ho tro automatic tuning, threat detection va long-term backup retention.

**Khi nao su dung:**
- Khi ung dung can SQL Server database ma khong muon tu quan ly server.
- Khi can automated backup, geo-replication va high availability.
- Khi muon su dung cac tinh nang SQL Server nhu stored procedure, T-SQL tren cloud.

**Huong dan co ban:**
1. Tao SQL server: `az sql server create --resource-group my-rg --name my-sql-server --admin-user myadmin --admin-password <password> --location southeastasia`.
2. Tao database: `az sql db create --resource-group my-rg --server my-sql-server --name my-db --service-objective S0`.
3. Cau hinh firewall rule cho phep ket noi tu Azure services va IP cua ban.
4. Ket noi tu ung dung su dung connection string.
5. Luu password trong Key Vault, khong hardcode trong code hoac config.

---

## 5. Blob Storage

**No la gi:**
Azure Blob Storage la dich vu object storage cua Azure, cho phep luu tru luong lon du lieu phi cau truc (blob). Blob Storage co ba loai: Block Blob (file thuong), Append Blob (log), Page Blob (VM disk). No ho tro nhieu access tier (Hot, Cool, Cold, Archive) de toi uu chi phi luu tru.

**Khi nao su dung:**
- Khi can luu tru artifact tu pipeline CI/CD (build output, package, backup).
- Khi can backend cho Terraform remote state.
- Khi can luu tru backup database, log file, media file hoac static asset.

**Huong dan co ban:**
1. Tao storage account: `az storage account create --resource-group my-rg --name mystorageaccount --sku Standard_LRS --location southeastasia`.
2. Tao container (tuong tu bucket): `az storage container create --account-name mystorageaccount --name artifacts`.
3. Upload file: `az storage blob upload --account-name mystorageaccount --container-name artifacts --file ./build.zip --name build.zip`.
4. Cau hinh lifecycle management policy de chuyen blob cu sang Cool/Archive tier.
5. Su dung cho Terraform backend: cau hinh `backend "azurerm"` trong file Terraform.

---

## 6. VNet - Virtual Network

**No la gi:**
VNet la mang ao rieng tren Azure, cho phep dinh nghia address space, subnet va kiem soat luu luong mang. VNet la nen tang networking cho moi tai nguyen Azure (AKS, VM, Azure SQL). VNet ho tro peering, VPN Gateway, ExpressRoute de ket noi voi cac mang khac hoac on-premise.

**Khi nao su dung:**
- Bat buoc khi trien khai bat ky tai nguyen networking nao tren Azure.
- Khi can tach biet moi truong (dev, staging, production) bang cac VNet rieng.
- Khi can ket noi on-premise voi Azure qua VPN Gateway hoac ExpressRoute.

**Huong dan co ban:**
1. Tao VNet: `az network vnet create --resource-group my-rg --name my-vnet --address-prefix 10.0.0.0/16 --location southeastasia`.
2. Tao subnet: `az network vnet subnet create --resource-group my-rg --vnet-name my-vnet --name my-subnet --address-prefix 10.0.1.0/24`.
3. Tao NSG (Network Security Group) va gan vao subnet de kiem soat traffic.
4. Cau hinh service endpoint hoac private endpoint cho Azure SQL, Key Vault.
5. Cau hinh VNet peering neu can ket noi giua cac VNet.

---

## 7. Azure AD / Managed Identity

**No la gi:**
Azure AD (nay la Microsoft Entra ID) la dich vu identity cua Azure, quan ly user, group, service principal va app registration. **Managed Identity** la co che cho phep tai nguyen Azure (AKS, VM, App Service) truy cap cac dich vu Azure khac ma khong can quan ly credential. Co hai loai: System-assigned va User-assigned Managed Identity.

**Khi nao su dung:**
- Khi can xac thuc va phan quyen cho user/service truy cap tai nguyen Azure.
- Khi can cau hinh Managed Identity cho AKS pod de truy cap Key Vault, ACR, Blob Storage.
- Khi can tich hop Azure AD RBAC voi AKS de quan ly quyen truy cap cluster.

**Huong dan co ban:**
1. Tao User-assigned Managed Identity: `az identity create --resource-group my-rg --name my-identity`.
2. Gan role cho Managed Identity: `az role assignment create --assignee <identity-principal-id> --role "AcrPull" --scope <acr-resource-id>`.
3. Cau hinh AKS voi Managed Identity: su dung `--enable-managed-identity` khi tao cluster.
4. Voi AKS Workload Identity: lien ket Kubernetes Service Account voi Managed Identity.
5. Ap dung nguyen tac least privilege — chi cap dung role can thiet.

---

## 8. Azure DevOps Pipelines

**No la gi:**
Azure DevOps Pipelines la dich vu CI/CD cua Microsoft, ho tro build, test va deploy tu dong. Pipeline duoc dinh nghia trong file `azure-pipelines.yml` voi cac stage, job va task. Azure DevOps cung cap Microsoft-hosted agent (khong can quan ly server) va ho tro self-hosted agent. No tich hop chat voi cac dich vu Azure va ca GitHub.

**Khi nao su dung:**
- Khi muon xay dung pipeline CI/CD tren Azure ma khong can tool ben ngoai.
- Khi da su dung Azure DevOps cho source control (Azure Repos) hoac work tracking.
- Khi can tich hop sau voi cac dich vu Azure (AKS, ACR, Key Vault) voi service connection.

**Huong dan co ban:**
1. Tao file `azure-pipelines.yml` trong root cua repo.
2. Dinh nghia trigger, stage, job va task (vd: Docker build, kubectl deploy).
3. Tao service connection den Azure subscription trong Azure DevOps.
4. Tao pipeline trong Azure DevOps ket noi voi repo (Azure Repos hoac GitHub).
5. Cau hinh variable group va secret variable cho cac bien moi truong.

---

## 9. Azure DNS

**No la gi:**
Azure DNS la dich vu DNS cua Azure, cho phep quan ly DNS zone va record. Azure DNS ho tro public zone va private zone (cho VNet). No tich hop voi cac dich vu Azure khac va ho tro alias record de tro truc tiep den Azure resource (Load Balancer, Front Door, Public IP).

**Khi nao su dung:**
- Khi can quan ly DNS cho ung dung deploy tren Azure.
- Khi can tao record tro ve Azure Load Balancer, Front Door hoac AKS Ingress IP.
- Khi can private DNS zone cho internal service discovery trong VNet.

**Huong dan co ban:**
1. Tao DNS zone: `az network dns zone create --resource-group my-rg --name myapp.com`.
2. Cap nhat nameserver tai nha dang ky domain tro ve Azure DNS nameserver.
3. Tao A record: `az network dns record-set a add-record --resource-group my-rg --zone-name myapp.com --record-set-name @ --ipv4-address <LB-IP>`.
4. Tao CNAME cho subdomain: `az network dns record-set cname set-record --resource-group my-rg --zone-name myapp.com --record-set-name api --cname myapp.com`.
5. Su dung private DNS zone cho internal service trong VNet.

---

## 10. Azure CDN

**No la gi:**
Azure CDN la dich vu CDN cua Azure, cache noi dung tai cac point of presence (POP) tren toan cau. Azure CDN ho tro nhieu provider profile (Microsoft, Akamai, Verizon) voi cac tinh nang khac nhau. No co the cache content tu Blob Storage, Web App, hoac bat ky origin nao co public endpoint.

**Khi nao su dung:**
- Khi can phan phoi static asset (JS, CSS, image) nhanh cho nguoi dung toan cau.
- Khi muon cache content tu Blob Storage hoac App Service de giam latency.
- Khi can HTTPS voi custom domain cho static website tren Blob Storage.

**Huong dan co ban:**
1. Tao CDN profile: `az cdn profile create --resource-group my-rg --name my-cdn-profile --sku Standard_Microsoft`.
2. Tao CDN endpoint: `az cdn endpoint create --resource-group my-rg --profile-name my-cdn-profile --name my-endpoint --origin mystorageaccount.blob.core.windows.net`.
3. Cau hinh custom domain va HTTPS.
4. Cau hinh caching rules (TTL, query string caching behavior).
5. Purge cache khi can cap nhat noi dung: `az cdn endpoint purge --resource-group my-rg --profile-name my-cdn-profile --name my-endpoint --content-paths "/*"`.

---

## 11. Key Vault

**No la gi:**
Key Vault la dich vu quan ly secret, key va certificate cua Azure. Key Vault cho phep luu tru an toan database password, API key, connection string, TLS certificate va encryption key. No ho tro access policy hoac Azure RBAC de kiem soat quyen truy cap, va tich hop voi AKS qua CSI driver de mount secret vao pod.

**Khi nao su dung:**
- Khi can luu tru database password, API key, connection string cho ung dung.
- Khi can quan ly TLS certificate (tu dong gia han voi CA tich hop).
- Khi can cung cap secret cho AKS pod hoac Azure DevOps pipeline.

**Huong dan co ban:**
1. Tao Key Vault: `az keyvault create --resource-group my-rg --name my-keyvault --location southeastasia`.
2. Them secret: `az keyvault secret set --vault-name my-keyvault --name db-password --value "my-password"`.
3. Doc secret: `az keyvault secret show --vault-name my-keyvault --name db-password`.
4. Cau hinh access policy hoac RBAC cho Managed Identity cua AKS.
5. Voi AKS: cai dat Secrets Store CSI Driver va tao SecretProviderClass de mount secret vao pod.

---

## 12. Azure Front Door

**No la gi:**
Azure Front Door la dich vu global load balancer ket hop CDN, WAF va SSL offloading cua Azure. Front Door hoat dong o lop 7 (HTTP/HTTPS), phan phoi traffic den cac backend tren nhieu region dua tren latency, priority hoac weight. No tich hop san Web Application Firewall (WAF) va ho tro custom domain voi managed certificate.

**Khi nao su dung:**
- Khi can global load balancing cho ung dung deploy o nhieu region.
- Khi can ket hop CDN + WAF + SSL trong mot dich vu duy nhat.
- Khi can failover tu dong giua cac region voi health probe.

**Huong dan co ban:**
1. Tao Front Door profile: `az afd profile create --resource-group my-rg --profile-name my-frontdoor --sku Standard_AzureFrontDoor`.
2. Tao endpoint: `az afd endpoint create --resource-group my-rg --profile-name my-frontdoor --endpoint-name my-endpoint`.
3. Tao origin group va origin tro ve backend (AKS Ingress, App Service).
4. Tao route de map domain/path den origin group.
5. Cau hinh WAF policy neu can bao ve chong DDoS va cac tan cong web.

---

## Luu y chung

- Tat ca cac dich vu tren nen duoc cau hinh bang IaC (Terraform, ARM Template, Bicep) de dam bao reproducibility.
- Khong commit client secret, tenant ID thuc te, subscription ID hoac bat ky thong tin xac thuc nao vao repository.
- Uu tien su dung Managed Identity thay vi service principal voi client secret.
- Tham khao thu muc `cloud/azure/deploy/` de xem cac deploy template tich hop voi cac dich vu nay.
