import Hero from "@/components/home/Hero";
import ClientStrip from "@/components/home/ClientStrip";
import ProblemSection from "@/components/home/ProblemSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedWork from "@/components/home/FeaturedWork";
import ApproachSection from "@/components/home/ApproachSection";
import ProofBar from "@/components/home/ProofBar";
import Testimonial from "@/components/home/Testimonial";
import FAQSection from "@/components/home/FAQSection";
import CTABand from "@/components/home/CTABand";

export default function Home() {
  return (
    <>
      <Hero />
      <ClientStrip />
      <ProblemSection />
      <ServicesSection />
      <FeaturedWork />
      <ApproachSection />
      <ProofBar />
      <Testimonial />
      <FAQSection />
      <CTABand />
    </>
  );
}
