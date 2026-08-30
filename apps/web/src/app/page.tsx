import { CTA } from "@/components/landing/CTA";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LiveStats } from "@/components/landing/LiveStats";
import { Navbar } from "@/components/landing/Navbar";
import { WhyBombardier } from "@/components/landing/WhyBombardier";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <Navbar />
      <main>
        <Hero />
        <LiveStats />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <WhyBombardier />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
