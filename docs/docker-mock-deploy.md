# Docker Mock Deployment

앱과 PostgreSQL을 Docker Compose로 함께 띄우는 미세먼지 목버전 배포 방법입니다.

## 요구사항

- Docker
- Docker Compose plugin

Ubuntu 서버에 Docker가 없다면:

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
newgrp docker
```

## 배포

```bash
git clone https://github.com/AldinYun/evcharge.git
cd evcharge
docker compose up -d --build
```

접속:

```text
http://서버IP:3000
```

## 포함되는 것

- Next.js production app
- PostgreSQL 16
- Prisma migration 자동 실행
- 컨테이너 시작 시 mock 미세먼지 pipeline 자동 실행
- 실제 API 없이 mock collector 사용

## 실제 AirKorea API 사용

`docker-compose.yml`의 `AIR_API_KEY`에 공공데이터포털 인증키를 넣으면 실제 API collector가 동작합니다.

```yaml
environment:
  AIR_API_BASE_URL: "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc"
  AIR_STATION_API_BASE_URL: "https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc"
  AIR_API_KEY: "공공데이터포털_인증키"
```

전국 17개 시도 기준 1회 수집은 약 34 API call입니다. 일일 트래픽 500이면 2시간 주기 cron을 권장합니다.

## 상태 확인

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f postgres
```

## mock pipeline 다시 실행

```bash
docker compose exec app npm run pipeline:mock
```

## cron API 테스트

```bash
curl -H "x-cron-secret: change-me" http://127.0.0.1:3000/api/cron/air-status
```

## 업데이트

```bash
git pull
docker compose up -d --build
```

## 종료

```bash
docker compose down
```

DB 볼륨까지 삭제하려면:

```bash
docker compose down -v
```
