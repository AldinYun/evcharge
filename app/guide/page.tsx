import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, InfoSection } from "@/components/layout/InfoPage";

export const metadata: Metadata = {
  title: "미세먼지 생활 가이드",
  description: "미세먼지, 초미세먼지, 환기, 실내 공기 관리 기준을 생활 관점에서 정리했습니다.",
  alternates: { canonical: "/guide" }
};

const guides = [
  {
    href: "/guide/fine-dust",
    title: "미세먼지와 초미세먼지 차이",
    description: "PM10과 PM2.5가 무엇을 뜻하는지, 왜 따로 봐야 하는지 정리했습니다."
  },
  {
    href: "/guide/ventilation",
    title: "환기하기 좋은 날 기준",
    description: "창문을 열어도 되는 날과 짧게 환기해야 하는 날을 구분하는 방법입니다."
  },
  {
    href: "/guide/air-quality-score",
    title: "에어체크 점수 계산 방식",
    description: "미세먼지, 초미세먼지, 습도, 바람을 어떻게 생활 점수로 바꾸는지 설명합니다."
  },
  {
    href: "/guide/indoor-air",
    title: "실내 공기 관리 방법",
    description: "공기청정기, 청소, 조리 후 환기처럼 집에서 바로 쓰는 관리 기준입니다."
  },
  {
    href: "/guide/data-source",
    title: "대기질 데이터 출처와 갱신",
    description: "에어체크가 어떤 공공 데이터를 사용하고 얼마나 자주 갱신하는지 안내합니다."
  }
];

export default function GuidePage() {
  return (
    <InfoPage title="미세먼지 생활 가이드" description="오늘 수치가 어떤 의미인지, 집과 바깥에서 어떻게 움직이면 좋은지 쉽게 정리했습니다.">
      <InfoSection title="가이드 목록">
        <div className="grid gap-3">
          {guides.map((guide) => (
            <Link key={guide.href} href={guide.href} className="rounded-lg border border-slate-200 p-4 hover:border-teal-400 hover:bg-teal-50/40">
              <strong className="block text-slate-950">{guide.title}</strong>
              <span className="mt-1 block text-sm text-slate-600">{guide.description}</span>
            </Link>
          ))}
        </div>
      </InfoSection>
    </InfoPage>
  );
}
