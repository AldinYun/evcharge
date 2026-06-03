export const percent = (value: number) => `${Math.round(value * 1000) / 10}%`;
export const number = (value: number) => new Intl.NumberFormat("ko-KR").format(value);
export const dateTime = (value: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul"
  }).format(value);

export const airGradeLabel = (value: string) => {
  if (value === "good") return "좋음";
  if (value === "moderate") return "보통";
  if (value === "bad") return "나쁨";
  if (value === "very_bad") return "매우 나쁨";
  return "확인 필요";
};

export const ventilationStatusLabel = (value: string) => {
  if (value === "recommended") return "환기 좋음";
  if (value === "caution") return "짧게 환기";
  if (value === "avoid") return "환기 피하기";
  return "확인 필요";
};

export const microgram = (value: number) => `${Math.round(value)}㎍/㎥`;
