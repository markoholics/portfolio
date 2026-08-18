import { faqItems } from "@/lib/data";
import FAQAccordion from "@/components/FAQAccordion";

export default function FAQSection() {
  return <FAQAccordion items={faqItems} eyebrow="Common Questions" heading="Before you book." />;
}
