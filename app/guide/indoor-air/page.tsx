import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "실내 공기 관리 방법",
  description: "미세먼지가 있는 날 실내 공기를 관리하는 현실적인 방법을 정리했습니다.",
  alternates: { canonical: "/guide/indoor-air" }
};

export default function IndoorAirGuidePage() {
  return (
    <InfoPage title="실내 공기 관리 방법" description="환기를 무조건 피하기보다 바깥 공기 상태에 맞춰 짧게 조절하는 것이 좋습니다.">
      <InfoSection title="나쁨 등급일 때">
        <p>
          바깥 공기가 나쁘면 창문을 오래 열어두기보다 필요한 시간에만 짧게 환기하세요. 조리나 청소 후에는 실내 오염이 생길 수 있어, 외부 농도가
          아주 높지 않은 시간대를 골라 짧게 빼주는 것이 좋습니다.
        </p>
      </InfoSection>
      <InfoSection title="공기청정기와 환기">
        <p>
          공기청정기는 실내 입자를 줄이는 데 도움이 되지만 이산화탄소나 냄새를 모두 해결하지는 못합니다. 환기하기 어려운 날에는 공기청정기를
          켜고, 환기가 가능한 시간대에 짧게 창문을 여는 식으로 조합하는 것이 좋습니다.
        </p>
      </InfoSection>
      <InfoSection title="생활 습관">
        <p>
          외출 후 옷을 털고 손을 씻는 것, 바닥 먼지를 젖은 걸레로 정리하는 것만으로도 실내 먼지를 줄이는 데 도움이 됩니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
