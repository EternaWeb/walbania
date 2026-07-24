import { createFileRoute } from "@tanstack/react-router";
import privacyPolicy from "../content/legal/privacy.md?raw";
import legalCss from "../legal.css?url";
import { LegalDocumentPage } from "../components/LegalDocumentPage";
import { SITE_NAME, SITE_URL } from "../lib/site";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: `Privacy and Cookie Policy | ${SITE_NAME}` },
      {
        name: "description",
        content:
          "How Wonder Albania collects, uses, shares and protects personal information and uses cookies and similar technologies.",
      },
      { property: "og:title", content: `Privacy and Cookie Policy | ${SITE_NAME}` },
      {
        property: "og:description",
        content:
          "How Wonder Albania handles personal information, cookies and similar technologies.",
      },
      { property: "og:url", content: `${SITE_URL}/privacy-policy` },
    ],
    links: [
      { rel: "stylesheet", href: legalCss },
      { rel: "canonical", href: `${SITE_URL}/privacy-policy` },
    ],
  }),
  component: PrivacyPolicyRoute,
});

function PrivacyPolicyRoute() {
  return (
    <LegalDocumentPage
      title="Privacy and Cookie Policy"
      summary="How Wonder Albania collects, uses, shares and protects personal information."
      note="We do not sell personal information. Optional technologies are used only where permitted, and the current website technology register is included below."
      markdown={privacyPolicy}
    />
  );
}
