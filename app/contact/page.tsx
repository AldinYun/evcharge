import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "문의",
  description: "에어체크 운영 문의, 데이터 오류 제보, 광고 관련 연락 방법을 안내합니다.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <InfoPage title="문의" description="데이터 오류, 서비스 이용 문제, 광고 관련 문의를 남길 수 있는 안내 페이지입니다.">
      <InfoSection title="운영 문의">
        <p>
          에어체크는 개인 운영 서비스입니다. 측정소 위치 오류, 지역명 오류, 데이터 갱신 문제를 발견하면 아래 연락처로 알려주세요.
        </p>
        <p className="font-medium text-slate-950">aldincle@gmail.com</p>
      </InfoSection>
      <InfoSection title="문의할 때 알려주면 좋은 내용">
        <ul className="list-disc space-y-1 pl-5">
          <li>문제가 발생한 페이지 주소</li>
          <li>확인한 시간</li>
          <li>오류로 보이는 지역명이나 측정소명</li>
          <li>사용 중인 기기와 브라우저</li>
        </ul>
      </InfoSection>
      <InfoSection title="답변 안내">
        <p>
          운영 상황에 따라 답변이 늦을 수 있습니다. 공공 API 장애나 측정소 점검으로 생긴 데이터 공백은 즉시 수정이 어려울 수 있습니다.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
