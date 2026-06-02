import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전기차 충전 분석 대시보드",
  description: "공공 API 데이터 파이프라인을 고려한 전기차 충전 인프라 분석 대시보드"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
