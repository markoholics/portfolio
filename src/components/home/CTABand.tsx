import MagneticButton from "@/components/MagneticButton";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";
import { CONTACT_EMAIL } from "@/lib/data";

const [CONTACT_EMAIL_USER, CONTACT_EMAIL_DOMAIN] = CONTACT_EMAIL.split("@");

export default function CTABand() {
  return (
    <section className="section-pad bg-black border-t hairline">
      <div className="container-edge text-center">
        <Reveal>
          <span className="eyebrow block mb-8" style={{ color: "var(--color-accent)" }}>
            Ready to Build Your Engine
          </span>
          <h2 className="font-display text-white text-4xl md:text-6xl lg:text-7xl leading-[0.95] max-w-4xl mx-auto">
            <TextReveal
              text="Stop guessing. Start compounding."
              triggerOnView
              className="block"
            />
          </h2>
          <p className="text-grey text-lg max-w-xl mx-auto mt-8">
            Book a 30-minute GTM strategy call. We will tell you exactly where your
            current motion is leaking revenue and what the first 30 days look like.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <MagneticButton href="/contact" variant="solid">
              Book a GTM Strategy Call
            </MagneticButton>
            <ObfuscatedEmail
              user={CONTACT_EMAIL_USER}
              domain={CONTACT_EMAIL_DOMAIN}
              className="btn-outline"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
