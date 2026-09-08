import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { brand } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kryptonix Digital & AI Solutions collects, uses and protects the information you share through this website.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="This page is a placeholder and has not yet been reviewed."
      intro={`This page will set out how ${brand.name} ${brand.tagline} collects, uses, stores and protects the information you share with us.`}
      sections={[
        {
          heading: "What we collect",
          body: "The details you submit through our forms — your name, email address, phone number, business name, what you're looking for, and, if you apply for a role, your resume and any message you include.",
        },
        {
          heading: "How we use it",
          body: "Only to reply to you and to discuss the work you enquired about. We do not sell your information, and we do not share it with third parties for marketing.",
        },
        {
          heading: "How long we keep it",
          body: "For as long as we need it to answer your enquiry and any follow-up, unless you ask us to delete it sooner.",
        },
        {
          heading: "Your choices",
          body: `Write to us at ${brand.email} to ask what we hold about you, to correct it, or to have it deleted.`,
        },
      ]}
    />
  );
}
