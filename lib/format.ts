export const percent = (value: number) => `${Math.round(value * 1000) / 10}%`;
export const number = (value: number) => new Intl.NumberFormat("ko-KR").format(value);
export const dateTime = (value: Date) =>
  new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(value);
