# EV Charge Analytics

Next.js App Router, TypeScript strict mode, Tailwind CSS, Prisma, PostgreSQL, Recharts 기반의 전기차 충전 인프라 분석 대시보드입니다.

현재 버전은 실제 공공 API 없이 mock collector로 완전히 동작합니다. 다만 `lib/pipeline/collector.ts`에 실제 API URL, API KEY, 페이지네이션, retry 구조를 미리 마련했습니다. SLM, LLM, AI 요약 호출 코드는 포함하지 않았고 모든 지표는 deterministic rule-based 공식으로 계산합니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 환경변수 예시

```env
DATABASE_URL="postgresql://user:password@localhost:5432/evcharge"
EV_API_BASE_URL=
EV_API_KEY=
CRON_SECRET=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

`EV_API_BASE_URL` 또는 `EV_API_KEY`가 비어 있으면 mock 데이터 수집기로 동작합니다.

## Prisma migration

```bash
npm run prisma:generate
npm run prisma:migrate
```

운영 서버에서는 다음 명령을 사용합니다.

```bash
npm run prisma:deploy
```

`prisma/schema.prisma`에는 `Station`, `Charger`, `ChargerStatusSnapshot`, `RegionMetric`, `StationMetric`, `RawEvApiResponse`, `PipelineRun` 모델이 포함되어 있습니다.

## Mock pipeline 실행

```bash
npm run pipeline:mock
```

파이프라인 순서:

```text
collect -> normalize -> save -> aggregate -> cache
```

DB 연결 또는 저장 단계가 실패하면 집계까지 완료한 뒤 `partial_success`를 반환하도록 구성했습니다.

## Cron API 호출

```bash
curl "http://localhost:3000/api/cron/ev-status?secret=$CRON_SECRET"
```

또는 헤더를 사용할 수 있습니다.

```bash
curl -H "x-cron-secret: $CRON_SECRET" http://localhost:3000/api/cron/ev-status
```

## 실제 공공 API 연결 위치

실제 API 연결은 `lib/pipeline/collector.ts`의 `collectEvApiData()`에서 처리합니다.

- `EV_API_BASE_URL`: 공공 API endpoint
- `EV_API_KEY`: 인증 키
- `pageNo`, `numOfRows`: 페이지네이션 파라미터
- 실패 시 `withRetry()`로 재시도

외부 응답 형식이 달라지면 `lib/pipeline/normalizer.ts`에서 내부 `Station`, `Charger` 타입으로 변환 규칙을 조정하면 됩니다.

## 주요 화면

- `/`: 전국 분석 대시보드
- `/region/[sido]`: 지역별 분석 페이지
- `/station/[stationId]`: 충전소 상세 페이지
- `/rankings`: 전국 지역 순위
- `/data-status`: 데이터 수집 상태
- `/api/cron/ev-status`: cron 파이프라인 실행 API

## 향후 개선 방향

- 실제 공공 API 응답 스키마에 맞춘 normalizer 확장
- Redis 또는 Next.js cache handler 기반 집계 캐시 저장
- Vercel Cron 또는 별도 scheduler 연동
- 관리자용 수집 로그 상세 화면
- 지역별 지도 및 좌표 기반 주변 충전소 탐색
- 장애 상태 장기 추세 분석

## Ubuntu 배포

Ubuntu 서버 배포 절차는 `docs/ubuntu-deploy.md`에 정리되어 있습니다.

핵심 흐름:

```bash
npm ci
npm run prisma:deploy
npm run build
pm2 start ecosystem.config.cjs
```
