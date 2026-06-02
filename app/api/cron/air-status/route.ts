import { NextRequest, NextResponse } from "next/server";
import { runAirQualityPipeline } from "@/lib/pipeline";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = request.headers.get("x-cron-secret") ?? request.nextUrl.searchParams.get("secret");

  if (secret && provided !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAirQualityPipeline();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, status: "failed", error: error instanceof Error ? error.message : "Unknown failure" },
      { status: 500 }
    );
  }
}
