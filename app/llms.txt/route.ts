import { FAQ, HIRING, SERVICES, SITE } from "@/lib/site";
import { DESCRIPTION, PUBLIC_EMAIL, SITE_URL } from "@/lib/seo";

/**
 * /llms.txt: a plain summary of UDVOY IT for AI assistants and answer engines (ChatGPT, Perplexity,
 * Claude, Gemini…), built from the same content as the page so it never goes out of date.
 * Generated once at build time.
 */
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${DESCRIPTION}`,
    "",
    `${SITE.name} is a technology company with a team in ${SITE.locations}, working with brands and businesses worldwide. Its main work is Shopify stores, e-commerce, and hiring and managing remote employees.`,
    "",
    "## Services",
    "",
    ...SERVICES.map((s) => `- [${s.title}](${SITE_URL}/services/${s.slug}): ${s.text}`),
    "",
    "## Remote hiring & management",
    "",
    ...HIRING.modes.map((m) => `- **${m.title}**: ${m.text}`),
    "",
    `Roles we hire for: ${HIRING.roles.join(", ")}.`,
    "",
    "## FAQ",
    "",
    ...FAQ.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Links",
    "",
    `- [Website](${SITE_URL}/)`,
    `- [Services](${SITE_URL}/#services)`,
    `- [Remote hiring](${SITE_URL}/#hiring)`,
    `- [Team](${SITE_URL}/#team)`,
    `- [Contact](${SITE_URL}/#contact)`,
    ...(PUBLIC_EMAIL ? [`- Email: ${PUBLIC_EMAIL}`] : []),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
