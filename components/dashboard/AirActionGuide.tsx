import type { AirGrade, VentilationStatus } from "@/lib/types";

type GuideTone = "good" | "moderate" | "bad" | "veryBad";

const gradeGuides: Record<AirGrade, { title: string; tone: GuideTone; items: string[] }> = {
  good: {
    title: "공기가 좋은 편입니다",
    tone: "good",
    items: [
      "짧게 창문을 열어 실내 공기를 바꾸기 좋습니다.",
      "산책이나 가벼운 야외활동을 하기에도 부담이 적습니다.",
      "빨래는 창가보다 통풍이 되는 곳에서 말리면 좋습니다."
    ]
  },
  moderate: {
    title: "대체로 보통 수준입니다",
    tone: "moderate",
    items: [
      "환기는 10~20분 정도로 짧게 나누어 하는 편이 좋습니다.",
      "민감군은 장시간 야외활동을 줄이면 더 안전합니다.",
      "실내 먼지가 많다면 환기 후 청소를 함께 해주세요."
    ]
  },
  bad: {
    title: "주의가 필요한 공기입니다",
    tone: "bad",
    items: [
      "창문을 오래 열어두는 환기는 피하는 편이 좋습니다.",
      "외출 시간이 길다면 보건용 마스크를 준비해 주세요.",
      "아이와 민감군은 실내 활동 위주로 일정을 조정해 주세요."
    ]
  },
  very_bad: {
    title: "실외 공기 유입을 줄여 주세요",
    tone: "veryBad",
    items: [
      "환기는 꼭 필요한 시간에만 아주 짧게 해주세요.",
      "어린이, 노약자, 호흡기 질환자는 외출을 줄이는 편이 좋습니다.",
      "실내에서는 공기청정기 필터 상태와 창문 틈새를 확인해 주세요."
    ]
  }
};

const toneClass: Record<GuideTone, string> = {
  good: "border-teal-200 bg-teal-50 text-teal-900",
  moderate: "border-amber-200 bg-amber-50 text-amber-950",
  bad: "border-orange-200 bg-orange-50 text-orange-950",
  veryBad: "border-rose-200 bg-rose-50 text-rose-950"
};

export function AirActionGuide({ grade, ventilationStatus }: { grade: AirGrade; ventilationStatus?: VentilationStatus }) {
  const guide = gradeGuides[grade];
  const ventilationNote =
    ventilationStatus === "recommended"
      ? "지금은 짧게 환기하기 좋은 조건입니다."
      : ventilationStatus === "avoid"
        ? "지금은 환기를 미루거나 시간을 짧게 잡는 편이 좋습니다."
        : "환기 전후로 실내 공기 상태를 함께 확인해 주세요.";

  return (
    <section className={`rounded-lg border p-4 shadow-soft ${toneClass[guide.tone]}`}>
      <h2 className="text-lg font-semibold">{guide.title}</h2>
      <p className="mt-2 text-sm leading-6">{ventilationNote}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6">
        {guide.items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
