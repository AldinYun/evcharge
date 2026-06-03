import type { Metadata } from "next";
import { AccessTracker } from "@/components/analytics/AccessTracker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://aircheck.kr"),
  title: {
    default: "에어체크 | 오늘의 미세먼지와 환기 정보",
    template: "%s | 에어체크"
  },
  description: "전국 측정소의 미세먼지, 초미세먼지, 기상 정보를 바탕으로 오늘 환기하기 좋은 지역을 보여줍니다.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "에어체크",
    title: "에어체크 | 오늘의 미세먼지와 환기 정보",
    description: "전국 대기질과 환기 정보를 한눈에 확인합니다.",
    url: "/"
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AccessTracker />
        {children}
      </body>
    </html>
  );
}
