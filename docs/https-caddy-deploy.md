# HTTPS 배포: Caddy + Let's Encrypt

이 프로젝트는 Docker Compose에 Caddy를 포함합니다. 도메인이 서버 공인 IP를 바라보고 있고 80/443 포트가 열려 있으면 Caddy가 Let's Encrypt 인증서를 자동으로 발급하고 갱신합니다.

## 사용자가 해야 할 일

1. 도메인을 구매합니다.
   - 예: `aircheck.kr`, `todayair.kr`

2. 도메인 DNS에 A 레코드를 추가합니다.
   - 이름: `@`
   - 값: 서버 공인 IP
   - `www`도 쓸 경우 `www` A 레코드를 같은 IP로 추가합니다.

3. 공유기 또는 클라우드 방화벽에서 포트를 엽니다.
   - TCP 80
   - TCP 443
   - UDP 443은 HTTP/3용이라 선택이지만 열어두면 좋습니다.

4. 서버의 프로젝트 폴더에 `.env`를 만듭니다.

```env
APP_DOMAIN=구매한도메인.kr
```

기존에 `.env`를 쓰고 있다면 `APP_DOMAIN` 한 줄만 추가하면 됩니다.

5. 배포합니다.

```bash
git pull
docker compose up -d --build
```

6. Caddy 로그를 확인합니다.

```bash
docker compose logs -f caddy
```

인증서 발급이 끝나면 아래 주소로 접속합니다.

```text
https://구매한도메인.kr
```

## 참고

- 앱 컨테이너의 3000번 포트는 서버 내부 `127.0.0.1:3000`에만 바인딩됩니다.
- 외부 공개 접속은 Caddy의 80/443 포트를 통해 처리됩니다.
- 도메인 DNS 전파가 끝나기 전에 실행하면 인증서 발급이 실패할 수 있습니다. 이 경우 잠시 후 `docker compose restart caddy`를 실행하면 됩니다.
- `APP_DOMAIN=localhost` 상태에서는 실제 공개 인증서가 발급되지 않습니다. 운영 배포 전 반드시 구매한 도메인으로 바꿔야 합니다.
