import { writings } from "@/lib/writings";

export const dynamic = "force-static";

const SITE_URL = "https://henryallen.dev";

function escapeXml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function GET() {
  const items = [...writings]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((w) => {
      const url = `${SITE_URL}/writing/${w.slug}`;
      return [
        "<item>",
        `<title>${escapeXml(w.title)}</title>`,
        `<link>${url}</link>`,
        `<guid>${url}</guid>`,
        `<pubDate>${new Date(w.date + "T00:00:00Z").toUTCString()}</pubDate>`,
        w.summary ? `<description>${escapeXml(w.summary)}</description>` : "",
        "</item>",
      ].join("");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>Henry Allen: Writings</title>
<link>${SITE_URL}</link>
<description>Essays and thoughts.</description>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
