import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "이용 안내",
  description: "에어체크의 대기질 정보 이용 범위와 주의 사항을 안내합니다.",
  alternates: {
    canonical: "/terms"
  }
};

export default function TermsPage() {
  return (
    <InfoPage title="이용 안내" description="에어체크를 사용할 때 알아두면 좋은 데이터 기준과 주의 사항입니다.">
      <InfoSection title="정보의 성격">
        <p>
          에어체크의 점수와 안내 문구는 공공 측정 자료를 바탕으로 만든 참고 정보입니다. 의료적 판단, 재난 대응, 사업장 안전 기준을 대신하지
          않습니다. 호흡기 질환이 있거나 민감군에 해당한다면 공식 예보와 전문가 안내를 함께 확인하는 것이 좋습니다.
        </p>
      </InfoSection>
      <InfoSection title="데이터 지연">
        <p>
          측정소 점검, 공공 API 장애, 네트워크 문제로 데이터가 늦게 반영될 수 있습니다. 각 페이지의 최근 갱신 시각과 데이터 상태 페이지를
          함께 확인해 주세요.
        </p>
      </InfoSection>
      <InfoSection title="외부 링크와 광고">
        <p>
          서비스에는 외부 사이트 링크나 광고 영역이 포함될 수 있습니다. 광고는 콘텐츠와 구분해 표시하며, 광고주의 상품이나 서비스 품질을
          에어체크가 보증하지 않습니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
