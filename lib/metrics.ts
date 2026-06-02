import type { AirGrade, VentilationStatus } from "@/lib/types";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function airGrade(pm10: number, pm25: number): AirGrade {
  if (pm10 <= 30 && pm25 <= 15) return "good";
  if (pm10 <= 80 && pm25 <= 35) return "moderate";
  if (pm10 <= 150 && pm25 <= 75) return "bad";
  return "very_bad";
}

export function ventilationStatus(pm10: number, pm25: number, windSpeed: number): VentilationStatus {
  if (pm10 <= 30 && pm25 <= 15 && windSpeed <= 8) return "recommended";
  if (pm10 <= 80 && pm25 <= 35 && windSpeed <= 12) return "caution";
  return "avoid";
}

export function freshnessScore(measuredAt: Date, now = new Date()) {
  const minutes = Math.max(0, now.getTime() - measuredAt.getTime()) / 60000;
  if (minutes <= 30) return 1;
  if (minutes <= 90) return 0.75;
  if (minutes <= 180) return 0.45;
  return 0.15;
}

export function ventilationScore(input: { pm10: number; pm25: number; humidity: number; windSpeed: number; freshnessScore: number }) {
  const pm10Score = clamp(100 - input.pm10 * 0.8);
  const pm25Score = clamp(100 - input.pm25 * 1.7);
  const humidityScore = clamp(100 - Math.abs(input.humidity - 50) * 1.5);
  const windScore = input.windSpeed <= 8 ? 100 : input.windSpeed <= 12 ? 65 : 25;
  return Math.round(
    clamp(pm10Score * 0.32 + pm25Score * 0.38 + humidityScore * 0.12 + windScore * 0.1 + input.freshnessScore * 100 * 0.08)
  );
}

export function outdoorActivityScore(input: { pm10: number; pm25: number; o3: number; freshnessScore: number }) {
  const pm10Score = clamp(100 - input.pm10 * 0.7);
  const pm25Score = clamp(100 - input.pm25 * 1.5);
  const ozoneScore = clamp(100 - input.o3 * 550);
  return Math.round(clamp(pm10Score * 0.28 + pm25Score * 0.42 + ozoneScore * 0.22 + input.freshnessScore * 100 * 0.08));
}

export function laundryScore(input: { pm10: number; pm25: number; humidity: number; windSpeed: number }) {
  const dustScore = clamp(100 - input.pm10 * 0.55 - input.pm25 * 1.2);
  const humidityScore = clamp(100 - Math.max(0, input.humidity - 55) * 2);
  const windScore = input.windSpeed >= 2 && input.windSpeed <= 9 ? 100 : 65;
  return Math.round(clamp(dustScore * 0.46 + humidityScore * 0.34 + windScore * 0.2));
}
