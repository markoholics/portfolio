// Opens a WhatsApp chat with the business number connected to Wati, via
// a wa.me deep link (no SDK, no widget script, nothing render blocking).
// Renders nothing if NEXT_PUBLIC_WHATSAPP_NUMBER isn't set yet, the same
// "a missing integration never breaks the page" convention used
// elsewhere on this site (src/lib/email.ts, src/lib/slack.ts). Once the
// Wati number is live, set that one env var and this link starts
// working, no code change needed.
//
// This is deliberately a plain wa.me link rather than Wati's own
// embeddable widget: it needs nothing from Wati's dashboard beyond the
// number itself. Once Wati setup is further along, its hosted widget
// (Team Inbox > Widget, or similar, naming varies by plan) can replace
// this component's contents with that embed snippet for a richer
// widget (online status, pre-chat form) without changing where it's used.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const PREFILL_MESSAGE = "Hi, I'd like to know more about Markoholics.";

export default function WhatsAppChatButton({ className = "btn-outline" }: { className?: string }) {
  if (!WHATSAPP_NUMBER) return null;

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL_MESSAGE)}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" data-cursor-hover className={className}>
      Chat on WhatsApp
    </a>
  );
}
