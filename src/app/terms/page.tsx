import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { brand } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply to using the Kryptonix Digital & AI Solutions website and enquiring about our services.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="This page is a placeholder and has not yet been reviewed."
      intro={`These terms will govern your use of this website and any enquiry you make to ${brand.name} ${brand.tagline}.`}
      sections={[
        {
          heading: "Using this site",
          body: "You may browse and use this website for the purpose of learning about our services and contacting us. Please do not attempt to disrupt it or use it to send anything unlawful.",
        },
        {
          heading: "Enquiries and quotes",
          body: "Submitting a form starts a conversation — it does not create a contract. Any engagement is governed by a separate written agreement between us.",
        },
        {
          heading: "Our work and content",
          body: "The text, design and code on this site belong to us. Product names shown as in development are exactly that: works in progress, with no guarantee of a release date or feature set.",
        },
        {
          heading: "Getting in touch",
          body: `Questions about these terms can go to ${brand.email}.`,
        },
      ]}
    />
  );
}
