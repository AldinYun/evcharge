import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { path?: string; referrer?: string };
    const path = body.path?.slice(0, 300);
    if (!path || path.startsWith("/api/")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await prisma.pageView.create({
      data: {
        path,
        referrer: body.referrer?.slice(0, 500),
        userAgent: request.headers.get("user-agent")?.slice(0, 500)
      }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
