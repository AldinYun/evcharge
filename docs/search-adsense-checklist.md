# Search Console and AdSense Checklist

## Search Console

1. Google Search Console에서 `aircheck.kr` 도메인 속성을 추가한다.
2. DNS TXT 레코드로 소유권을 인증한다.
3. 사이트맵을 제출한다.

```text
https://aircheck.kr/sitemap.xml
```

4. URL 검사에서 주요 페이지 색인을 요청한다.

```text
https://aircheck.kr
https://aircheck.kr/nearby
https://aircheck.kr/rankings
https://aircheck.kr/about
https://aircheck.kr/privacy
https://aircheck.kr/contact
```

## Robots

검색 허용:

```text
/
/nearby
/rankings
/region/*
/grade/*
/about
/privacy
/contact
/terms
```

검색 제외:

```text
/admin
/api
```

## AdSense

AdSense 승인 후 발급된 게시자 ID를 서버 `.env`에 넣는다.

```env
ADSENSE_PUBLISHER_ID=pub-0000000000000000
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000
```

적용:

```bash
docker compose up -d --force-recreate app
```

확인:

```bash
curl https://aircheck.kr/ads.txt
```

정상 예:

```text
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
```
