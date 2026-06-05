# Tài Nguyên Khóa Học DevOps Nâng Cao (Advanced DevOps Resources)

Thư mục này chứa toàn bộ các tài liệu hướng dẫn cài đặt, cấu hình, file cấu hình mẫu (manifests, playbooks, modules) phục vụ cho khóa học **DevOps Nâng Cao** (Advanced DevOps).

## Các Mảng Kiến Thức Triển Khai Tại Đây

1. **Infrastructure as Code (IaC):**
   * Hướng dẫn và mẫu cấu hình Terraform (Variables, Modules, S3 Backend, State Locking).
   * Hướng dẫn và cấu trúc thư mục Ansible Roles, quản lý cấu hình và mã hóa secret qua Ansible Vault.

2. **Centralized Logging & Observability (Quản lý Log tập trung):**
   * Triển khai cụm Elasticsearch, Fluent-bit thu thập log trên các node và Kubernetes.
   * Triển khai Grafana Loki + Promtail để thu thập log hiệu quả, gọn nhẹ.

3. **Secrets Management (Quản lý mã khóa bảo mật):**
   * Cài đặt và vận hành HashiCorp Vault Server chế độ Production.
   * Tích hợp Vault Agent Injector hoặc External Secrets Operator (ESO) vào Kubernetes.

4. **GitOps CD:**
   * Triển khai ArgoCD trên Kubernetes, quản lý cấu hình khai báo (Declarative) cho multi-cluster.

5. **Service Mesh:**
   * Cấu hình Istio Service Mesh, quản lý traffic routing, Mutual TLS (mTLS) và Authorization Policy.

---

## Cách Tổ Chức Thư Mục
* Khi học đến các phần thực hành, các bài viết hướng dẫn cài đặt sẽ được tạo tại đây.
* Các tệp tin cấu hình mẫu (ví dụ: `.tf`, `.yml`, `.ini`) sẽ được đặt trong các thư mục con tương ứng để dễ dàng sao chép và tái sử dụng.
