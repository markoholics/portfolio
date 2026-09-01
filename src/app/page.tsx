import Hero from "@/components/home/Hero";
import ClientStrip from "@/components/home/ClientStrip";
import StrategicPartners from "@/components/home/StrategicPartners";
import ProblemSection from "@/components/home/ProblemSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedWork from "@/components/home/FeaturedWork";
import ApproachSection from "@/components/home/ApproachSection";
import AiStackSection from "@/components/home/AiStackSection";
import ProofBar from "@/components/home/ProofBar";
import Testimonial, { featuredTestimonial } from "@/components/home/Testimonial";
import FAQSection from "@/components/home/FAQSection";
import CTABand from "@/components/home/CTABand";
import { reviewJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <Hero />
      <ClientStrip />
      <StrategicPartners />
      {/* TODO: re-add <PartnerStack /> here once the real partner logo
          PNGs (apollo, n8n, hubspot, flowkon) are in public/partners/ */}
      <ProblemSection />
      <ServicesSection />
      <FeaturedWork />
      <ApproachSection />
      <AiStackSection />
      <ProofBar />
      <Testimonial />
      <FAQSection />
      <CTABand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            reviewJsonLd({
              authorName: featuredTestimonial.quote.attribution,
              reviewBody: featuredTestimonial.quote.text,
            })
          ),
        }}
      />
    </>
  );
}
