# Air Vent Guide

미세먼지, 초미세먼지, 습도, 풍속을 기반으로 “지금 환기해도 되는지”를 계산하는 생활 대기질 대시보드입니다.

현재 버전은 실제 API 없이 mock 데이터로 완전히 동작합니다. 실제 AirKorea/공공데이터 API 연결은 `lib/pipeline/collector.ts`의 `collectAirApiData()`에서 환경변수 기반으로 처리하도록 준비되어 있습니다. 모든 점수는 LLM 없이 deterministic rule-based 공식으로 계산합니다.

## 주요 기능

- 전국 미세먼지·초미세먼지 현황
- 환기 가능 여부와 환기 점수
- 야외활동 점수, 빨래 점수
- 지역별 시도/시군구 랭킹
- 내 위치 기반 가까운 측정소 정렬
- mock collector, normalizer, DB 저장, 집계, 캐시 파이프라인
- Docker Compose 기반 앱 + PostgreSQL 목버전 배포

## 로컬 실행

```bash
npm install
npm run dev
```

## 환경변수

```env
DATABASE_URL="postgresql://user:password@localhost:5432/evcharge"
AIR_API_BASE_URL=
AIR_API_KEY=
CRON_SECRET="change-me"
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

`AIR_API_BASE_URL`, `AIR_API_KEY`가 비어 있으면 mock collector로 동작합니다.

## Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

운영/컨테이너에서는:

```bash
npm run prisma:deploy
```

## Mock pipeline

```bash
npm run pipeline:mock
```

파이프라인 순서:

```text
collect -> normalize -> save -> aggregate -> cache
```

DB 저장이 실패해도 mock 수집과 집계가 완료되면 `partial_success`를 반환합니다.

## Cron API

```bash
curl -H "x-cron-secret: change-me" http://localhost:3000/api/cron/air-status
```

## Docker 목버전 배포

```bash
git clone https://github.com/AldinYun/evcharge.git
cd evcharge
docker compose up -d --build
```

접속:

```text
http://서버IP:3000
```

Docker 구성은 PostgreSQL 16, Prisma migration, mock pipeline 자동 실행을 포함합니다.

자세한 Docker 배포법은 `docs/docker-mock-deploy.md`를 참고하세요.

## 주요 라우트

- `/`: 전국 환기 대시보드
- `/region/[sido]`: 지역별 미세먼지·환기 분석
- `/nearby`: 위치 기반 가까운 측정소
- `/rankings`: 전국 지역 순위
- `/data-status`: 데이터 수집 상태
- `/api/cron/air-status`: cron 파이프라인 실행 API
