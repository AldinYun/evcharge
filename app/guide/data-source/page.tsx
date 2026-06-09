import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "대기질 데이터 출처와 갱신",
  description: "에어체크가 사용하는 공공 대기질 데이터와 갱신 방식을 안내합니다.",
  alternates: { canonical: "/guide/data-source" }
};

export default function DataSourceGuidePage() {
  return (
    <InfoPage title="대기질 데이터 출처와 갱신" description="에어체크는 공공 측정 자료를 가져와 지역별 생활 지표로 정리합니다.">
      <InfoSection title="데이터 출처">
        <p>
          대기오염 측정값과 측정소 정보는 공공데이터포털과 에어코리아에서 제공하는 자료를 사용합니다. 지역별 수치는 측정소의 최신 값을 모아
          평균과 등급으로 정리합니다.
        </p>
      </InfoSection>
      <InfoSection title="갱신 주기">
        <p>
          운영 서버에서는 정해진 배치 작업이 공공 API를 호출해 데이터를 갱신합니다. 공공 API 장애, 측정소 점검, 네트워크 문제로 일부 시간대는
          갱신이 늦어질 수 있습니다.
        </p>
      </InfoSection>
      <InfoSection title="왜 실제 체감과 다를 수 있나요">
        <p>
          측정소는 집 앞이 아니라 지역의 대표 지점에 설치되어 있습니다. 도로, 공사장, 산지, 해안가처럼 주변 환경이 다르면 같은 시군구 안에서도
          체감 공기질이 달라질 수 있습니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
