import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "에어체크 점수 계산 방식",
  description: "에어체크가 미세먼지와 기상 정보를 생활 점수로 바꾸는 방식을 설명합니다.",
  alternates: { canonical: "/guide/air-quality-score" }
};

export default function AirQualityScoreGuidePage() {
  return (
    <InfoPage title="에어체크 점수 계산 방식" description="점수는 예측이나 AI 판단이 아니라 정해진 규칙으로 계산합니다.">
      <InfoSection title="점수에 들어가는 값">
        <p>
          환기 점수는 미세먼지, 초미세먼지, 습도, 풍속, 최근 측정 시각을 함께 봅니다. 먼지 농도가 낮고 측정값이 최신일수록 점수가 올라가며,
          바람이 너무 강하거나 습도 조건이 좋지 않으면 점수가 낮아집니다.
        </p>
      </InfoSection>
      <InfoSection title="점수 해석">
        <p>
          70점 이상이면 대체로 환기 부담이 낮은 편으로 보고, 중간 점수대는 짧은 환기나 상황 확인이 필요한 구간으로 봅니다. 점수가 낮으면
          환기 시간을 줄이거나 공기청정기 사용을 함께 고려하는 편이 좋습니다.
        </p>
      </InfoSection>
      <InfoSection title="주의할 점">
        <p>
          점수는 측정소 자료를 바탕으로 만든 생활 참고값입니다. 집 주변 도로, 공사장, 실내 조리, 청소 상태에 따라 실제 체감은 달라질 수 있습니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
