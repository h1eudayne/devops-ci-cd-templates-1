# Shared Docker Templates for Java

## Template hien co

- `maven-jar-openjdk8-jre-alpine.Dockerfile.example`
  Multi-stage Dockerfile cho du an Java build bang Maven, tao JAR va chay bang Java 8 tren Alpine voi non-root user.

## Khi nao nen dung

- Du an build bang Maven
- Artifact dau ra la runnable JAR
- Can mot Dockerfile don gian de dong goi va chay tren server hoac VPS
- Ung dung van chay tot voi Java 8

## Can doi gi truoc khi dung

- Doi gia tri mac dinh cua `ARG APP_JAR` cho dung voi artifact Maven thuc te, hoac truyen `--build-arg APP_JAR=...` khi build
- Doi user runtime neu ban muon dat theo ten he thong cua tung du an
- Doi `EXPOSE 8080` neu ung dung nghe o cong khac
- Neu du an can profile, Maven Wrapper, hoac build command khac, cap nhat lenh `mvn install -DskipTests=true`
- Neu ung dung can bien moi truong cho database, Redis, mail, hoac secret, truyen bang `-e` hoac `--env-file` khi chay container

## Cach dung nhanh

1. Copy `maven-jar-openjdk8-jre-alpine.Dockerfile.example` thanh `Dockerfile` trong project Java cua ban.
2. Doi `APP_JAR` trong Dockerfile, hoac build voi `docker build --build-arg APP_JAR=your-artifact.jar -t your-app .`
3. Chay image va map cong theo nhu cau cua project.

## Vi du build va run

Build image:

```powershell
docker build `
  --build-arg APP_JAR=shoe-ShoppingCart-0.0.1-SNAPSHOT.jar `
  -t shoe-shoppingcart .
```

Run container:

```powershell
docker run --name shoe-shoppingcart `
  -p 8080:8080 `
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/shoeshop" `
  -e SPRING_DATASOURCE_USERNAME="root" `
  -e SPRING_DATASOURCE_PASSWORD="secret" `
  shoe-shoppingcart
```

Neu ung dung khong phai Spring Boot, hay thay cac bien `SPRING_*` bang bien moi truong thuc te ma project dang doc.

## Template nay giai quyet gi

- Build project Maven thanh runnable JAR trong build stage
- Dong goi runtime Java 8 gon hon bang `openjdk8-jre-base`
- Chay container bang non-root user
- Don gian hoa `ENTRYPOINT` bang cach chay truc tiep file JAR da copy vao image

## Template nay chua giai quyet gi

- Chua tu dong biet ten JAR cua tung project, ban van can dat `APP_JAR`
- Chua tu dong inject secret hay profile cua tung moi truong, ban can truyen luc `docker run`, `docker compose`, hoac GitLab CI
- Chua co `healthcheck`, volume, hoac log path vi moi project co cach expose health va ghi log khac nhau

## Luu y

- Template nay giu cach build giong mau goc bang `mvn install -DskipTests=true` de phu hop voi cac du an da dung quy trinh nay.
- Runtime image dung `openjdk8-jre-base` de gon hon so voi cai full JDK, va goi truc tiep binary Java cua Alpine package de tranh phu thuoc vao PATH.
- File JAR trong runtime duoc copy thanh `/app/app.jar` de khong phai sua `ENTRYPOINT` moi khi version artifact thay doi.
- Neu project se build image trong GitLab CI va push len registry, co the ghep template nay voi `templates/gitlab-ci/continuous-delivery/docker/docker-image-server-tag-manual.yml`.
