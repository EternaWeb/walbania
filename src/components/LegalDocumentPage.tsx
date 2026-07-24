import { ArrowUpRight } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteLocaleProvider } from "../i18n";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type LegalDocumentPageProps = {
  title: string;
  summary: string;
  note: string;
  markdown: string;
};

const EFFECTIVE_DATE = "24 July 2026";
const remarkPlugins = [remarkGfm];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function documentBody(markdown: string) {
  return markdown
    .replace(/^# .+\r?\n+/, "")
    .replace(/^\*\*Effective date:\*\* [^\r\n]+\r?\n\*\*Last updated:\*\* [^\r\n]+\r?\n+/, "")
    .trim();
}

const markdownComponents: Components = {
  h2: ({ children }) => {
    const text = String(children);
    return <h2 id={slugify(text)}>{children}</h2>;
  },
  a: ({ href = "", children }) => {
    const external = href.startsWith("http");
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="legal-table-wrap">
      <table>{children}</table>
    </div>
  ),
};

export function LegalDocumentPage({ title, summary, note, markdown }: LegalDocumentPageProps) {
  const body = documentBody(markdown);
  const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => ({
    title: match[1],
    id: slugify(match[1]),
  }));

  return (
    <SiteLocaleProvider locale="en">
      <div className="legal-page min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main>
          <header className="legal-intro page-inset">
            <div className="legal-intro-copy">
              <h1>{title}</h1>
              <p>{summary}</p>
              <div className="legal-meta">
                <span>Effective {EFFECTIVE_DATE}</span>
                <a href="mailto:hello@wonderalbania.com">
                  Questions about this policy <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </header>

          <div className="legal-layout page-inset">
            <aside className="legal-nav" aria-label={`${title} sections`}>
              <p>On this page</p>
              <nav>
                {headings.map((heading) => (
                  <a href={`#${heading.id}`} key={heading.id}>
                    {heading.title.replace(/^\d+\.\s*/, "")}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="legal-content">
              <div className="legal-summary">
                <strong>Important</strong>
                <p>{note}</p>
              </div>

              <ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
                {body}
              </ReactMarkdown>
            </article>
          </div>
        </main>
        <SiteFooter />
      </div>
    </SiteLocaleProvider>
  );
}
