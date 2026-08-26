import { faqItems } from "@/lib/data";
import FAQAccordion from "@/components/FAQAccordion";

export default function FAQSection() {
  return <FAQAccordion items={faqItems} eyebrow="Frequently Asked Questions (FAQs)" heading="Before you book." />;
}
