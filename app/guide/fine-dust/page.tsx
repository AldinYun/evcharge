import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "미세먼지와 초미세먼지 차이",
  description: "미세먼지와 초미세먼지가 어떻게 다르고 생활 속에서 어떻게 확인하면 좋은지 정리했습니다.",
  alternates: { canonical: "/guide/fine-dust" }
};

export default function FineDustGuidePage() {
  return (
    <InfoPage title="미세먼지와 초미세먼지 차이" description="숫자는 비슷해 보여도 몸에 들어오는 방식과 주의 기준은 다릅니다.">
      <InfoSection title="미세먼지">
        <p>
          미세먼지는 보통 PM10을 말합니다. 지름이 10마이크로미터 이하인 입자로, 도로 먼지나 연소 과정에서 생긴 입자가 섞여 있습니다.
          수치가 높을수록 눈, 코, 목이 답답하게 느껴질 수 있고 창문을 오래 열어두는 것도 부담이 됩니다.
        </p>
      </InfoSection>
      <InfoSection title="초미세먼지">
        <p>
          초미세먼지는 PM2.5를 말합니다. 더 작은 입자라 실내로도 쉽게 들어오고 호흡기 깊은 곳까지 영향을 줄 수 있습니다. 같은 보통 등급이라도
          초미세먼지가 높다면 환기 시간을 짧게 잡는 편이 좋습니다.
        </p>
      </InfoSection>
      <InfoSection title="어떻게 보면 좋을까요">
        <p>
          바깥활동은 미세먼지와 초미세먼지를 함께 보고 판단하는 것이 좋습니다. 에어체크는 두 값을 함께 사용해 대기질 등급과 환기 점수를 계산합니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
