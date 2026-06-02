# Ubuntu Deployment Guide

Ubuntu 22.04/24.04 기준 배포 절차입니다. 앱은 Next.js production server를 PM2로 실행하고, Nginx가 80/443 요청을 `127.0.0.1:3000`으로 프록시합니다.

## 1. 서버 패키지 설치

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
CREATE USER evcharge WITH PASSWORD 'change-me';
CREATE DATABASE evcharge OWNER evcharge;
\q
```

## 3. 소스 배치

```bash
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
git clone https://github.com/AldinYun/evcharge.git /var/www/evcharge
cd /var/www/evcharge
npm ci
```

## 4. 환경변수 설정

```bash
cp .env.example .env
nano .env
```

필수값:

```env
DATABASE_URL="postgresql://evcharge:change-me@127.0.0.1:5432/evcharge"
CRON_SECRET="strong-random-secret"
EV_API_BASE_URL=
EV_API_KEY=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

현재 버전은 `EV_API_BASE_URL`, `EV_API_KEY`가 비어 있으면 mock collector로 동작합니다.

## 5. Prisma migration 및 빌드

```bash
npx prisma generate
npx prisma migrate deploy
npm run build
```

초기 mock 데이터 저장을 확인하려면 다음을 실행합니다.

```bash
npm run pipeline:mock
```

DB 연결이 정상이라면 `success`가 반환됩니다.

## 6. PM2 실행

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd
```

`pm2 startup systemd`가 출력하는 `sudo env ... pm2 startup ...` 명령을 그대로 한 번 더 실행합니다.

상태 확인:

```bash
pm2 status
pm2 logs evcharge
```

## 7. Nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/evcharge
```

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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/evcharge /etc/nginx/sites-enabled/evcharge
sudo nginx -t
sudo systemctl reload nginx
```

## 8. Cron 등록

서버 cron으로 10분마다 수집 API를 호출하는 예시입니다.

```bash
crontab -e
```

```cron
*/10 * * * * curl -fsS -H "x-cron-secret: strong-random-secret" http://127.0.0.1:3000/api/cron/ev-status >/dev/null 2>&1
```

## 9. HTTPS

도메인이 연결된 뒤 Certbot을 사용할 수 있습니다.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

## 10. 배포 업데이트

```bash
cd /var/www/evcharge
git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 restart evcharge
```
