export const dynamic = "force-dynamic";

export function GET() {
  const publisherId =
    process.env.ADSENSE_PUBLISHER_ID ?? process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.replace(/^ca-/, "");

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# AdSense approval 후 ADSENSE_PUBLISHER_ID=pub-... 환경변수를 설정하세요.\n";

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
