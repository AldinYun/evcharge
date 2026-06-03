import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "에어체크 소개",
  description: "에어체크가 어떤 대기질 정보를 모으고 어떻게 생활 지표로 정리하는지 안내합니다.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <InfoPage
      title="에어체크 소개"
      description="에어체크는 미세먼지 수치를 조금 더 생활에 가깝게 읽기 위해 만든 대기질 정보 서비스입니다."
    >
      <InfoSection title="무엇을 보여주나요">
        <p>
          전국 측정소의 미세먼지, 초미세먼지, 기상 자료를 모아 지역별 대기 상태와 환기 참고 정보를 보여줍니다. 단순히 수치만 나열하지 않고,
          오늘 바깥 공기를 들이기 괜찮은지, 야외활동이나 빨래 건조에 부담이 적은지 함께 볼 수 있게 정리합니다.
        </p>
      </InfoSection>
      <InfoSection title="어떻게 계산하나요">
        <p>
          에어체크의 생활 점수는 정해진 규칙에 따라 계산됩니다. 미세먼지와 초미세먼지 농도, 습도, 풍속, 최근 측정 시각을 함께 보고 0점부터
          100점까지의 점수로 바꿉니다. 점수는 참고용이며, 건강 상태나 실내 환경에 따라 실제 체감은 달라질 수 있습니다.
        </p>
      </InfoSection>
      <InfoSection title="데이터 출처">
        <p>
          현재 서비스는 공공데이터포털과 에어코리아에서 제공하는 대기오염 정보, 측정소 정보를 기반으로 운영됩니다. 수집 실패나 점검 시간에는
          최신 값 반영이 늦어질 수 있어, 데이터 갱신 상태를 별도로 표시합니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
