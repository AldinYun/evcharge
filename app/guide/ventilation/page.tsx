import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "환기하기 좋은 날 기준",
  description: "미세먼지, 초미세먼지, 바람, 습도를 함께 보고 환기 시간을 정하는 방법을 안내합니다.",
  alternates: { canonical: "/guide/ventilation" }
};

export default function VentilationGuidePage() {
  return (
    <InfoPage title="환기하기 좋은 날 기준" description="환기는 공기질이 좋을 때 짧고 확실하게 하는 편이 좋습니다.">
      <InfoSection title="먼저 먼지 농도를 봅니다">
        <p>
          미세먼지와 초미세먼지가 모두 낮은 날은 짧은 환기에 부담이 적습니다. 반대로 둘 중 하나라도 높다면 창문을 오래 열어두는 것보다 필요한
          시간만 열고 닫는 편이 낫습니다.
        </p>
      </InfoSection>
      <InfoSection title="바람이 너무 강한 날">
        <p>
          바람이 강하면 실내 먼지가 날리거나 외부 오염물질이 빠르게 들어올 수 있습니다. 이런 날은 환기 시간을 줄이고, 환기 후 바닥 먼지를
          가볍게 정리하는 것이 좋습니다.
        </p>
      </InfoSection>
      <InfoSection title="습도도 함께 봅니다">
        <p>
          습도가 너무 높으면 실내가 눅눅해지고, 너무 낮으면 목과 피부가 건조해질 수 있습니다. 에어체크의 환기 점수는 먼지 농도뿐 아니라 습도와
          풍속도 함께 반영합니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
