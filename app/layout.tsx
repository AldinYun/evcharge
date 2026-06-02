import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "미세먼지 환기 타이밍",
  description: "지역별 미세먼지, 초미세먼지, 환기 가능 여부를 자동 수집 데이터 기반으로 보여주는 생활 대기질 대시보드"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
