import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { MetricStrip } from "@/components/sections/MetricStrip";
import { Services } from "@/components/sections/Services";
import { SoftwareSolutions } from "@/components/sections/SoftwareSolutions";
import { GrowthChannels } from "@/components/sections/GrowthChannels";
import { ProcessResults } from "@/components/sections/ProcessResults";
import { FinalCta } from "@/components/sections/FinalCta";
import { DialogProvider } from "@/components/ui/DialogProvider";

/**
 * Narrative order: Build → Attract → Convert → Automate → Grow.
 * Hero (what we do) → proof → services → software (runs the business) →
 * SEO / Ads / AI (get found, drive traffic, save time) → process → results → CTA.
 *
 * DialogProvider wraps the page so every CTA — header, hero, services, the two
 * software cards and the closing banner — can open the strategy form or a
 * coming-soon modal without prop-drilling through the section tree.
 */
export default function HomePage() {
  return (
    <DialogProvider>
      <Header />
      <main id="main">
        <Hero />
        <MetricStrip />
        <Services />
        <SoftwareSolutions />
        <GrowthChannels />
        <ProcessResults />
        <FinalCta />
      </main>
      <Footer />
    </DialogProvider>
  );
}
