# Ubuntu Deployment Guide

Docker를 쓰지 않는 수동 배포 절차입니다. 목버전/간편 배포는 `docs/docker-mock-deploy.md`의 Docker Compose 방식을 권장합니다.

## 1. 패키지 설치

```bash
sudo apt update
sudo apt install -y curl git nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2. PostgreSQL 준비

```bash
sudo -u postgres psql
```

```sql
CREATE USER airvent WITH PASSWORD 'change-me';
CREATE DATABASE airvent OWNER airvent;
\q
```

## 3. 소스 배치

저장소 이름은 기존 GitHub repo 이름을 그대로 사용합니다.

```bash
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
git clone https://github.com/AldinYun/evcharge.git /var/www/airvent-guide
cd /var/www/airvent-guide
npm ci
```

## 4. 환경변수 설정

```bash
cp .env.example .env
nano .env
```

```env
DATABASE_URL="postgresql://airvent:change-me@127.0.0.1:5432/airvent"
AIR_API_BASE_URL="https://apis.data.go.kr/B552584/ArpltnInforInqireSvc"
AIR_STATION_API_BASE_URL="https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc"
AIR_FETCH_STATION_INFO="true"
AIR_API_KEY=
CRON_SECRET="strong-random-secret"
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

`AIR_API_KEY`가 비어 있으면 mock collector로 동작합니다.

## 5. Prisma migration 및 빌드

```bash
npx prisma generate
npx prisma migrate deploy
npm run build
npm run pipeline:mock
```

## 6. PM2 실행

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd
```

## 7. Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 8. Cron 등록

기능별 일일 500콜 기준, 전국 대기오염정보는 1시간 주기를 권장합니다.

```cron
0 * * * * curl -fsS -H "x-cron-secret: strong-random-secret" http://127.0.0.1:3000/api/cron/air-status >/dev/null 2>&1
```
