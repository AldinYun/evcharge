import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "에어체크의 개인정보 처리와 광고, 접속 통계 이용 방식을 안내합니다.",
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="개인정보처리방침"
      description="에어체크는 서비스 운영에 필요한 범위에서만 접속 정보를 확인하며, 민감한 개인정보를 요구하지 않습니다."
    >
      <InfoSection title="수집하는 정보">
        <p>
          에어체크는 회원가입을 받지 않으며 이름, 주민등록번호, 결제 정보 같은 개인정보를 직접 요구하지 않습니다. 서비스 품질 확인을 위해
          접속한 페이지, 접속 시각, 브라우저 정보, 대략적인 요청 IP 등 기본적인 접속 로그가 서버 또는 분석 도구에 기록될 수 있습니다.
        </p>
      </InfoSection>
      <InfoSection title="위치 정보">
        <p>
          내 주변 측정소 기능을 사용할 때 브라우저의 위치 권한을 요청할 수 있습니다. 위치 값은 가까운 측정소를 찾는 데 사용되며, 별도의 회원
          정보와 연결해 저장하지 않습니다. 위치 권한은 브라우저 설정에서 언제든지 해제할 수 있습니다.
        </p>
      </InfoSection>
      <InfoSection title="광고와 쿠키">
        <p>
          에어체크는 향후 Google AdSense 같은 광고 서비스를 사용할 수 있습니다. 광고 제공 과정에서 Google 등 제3자가 쿠키나 유사 기술을
          사용해 광고 노출, 부정 사용 방지, 광고 성과 측정을 처리할 수 있습니다. 맞춤 광고 설정은 Google 광고 설정 페이지에서 관리할 수 있습니다.
        </p>
      </InfoSection>
      <InfoSection title="문의">
        <p>
          개인정보 관련 문의는 문의 페이지를 통해 접수할 수 있습니다. 정책 내용은 서비스 운영 방식이 바뀌면 함께 업데이트됩니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
