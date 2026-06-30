import Hero from "@/components/home/Hero";
import ClientStrip from "@/components/home/ClientStrip";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedWork from "@/components/home/FeaturedWork";
import ApproachSection from "@/components/home/ApproachSection";
import ProofBar from "@/components/home/ProofBar";
import Testimonial from "@/components/home/Testimonial";
import CTABand from "@/components/home/CTABand";

export default function Home() {
  return (
    <>
      <Hero />
      <ClientStrip />
      <ServicesSection />
      <FeaturedWork />
      <ApproachSection />
      <ProofBar />
      <Testimonial />
      <CTABand />
    </>
  );
}
