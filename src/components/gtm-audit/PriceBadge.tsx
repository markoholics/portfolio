// Struck-through list price + "FREE", used everywhere the Sprint's price
// would otherwise appear on the /free-gtm-audit variant of this landing
// page. `strikeClassName` lets callers dim it appropriately against
// whatever background it sits on (e.g. black text on a lime button vs.
// white text on the page background).
export default function PriceBadge({
  strikeClassName = "text-white/40",
  freeClassName = "",
}: {
  strikeClassName?: string;
  freeClassName?: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <s className={strikeClassName}>$99</s>
      <b className={freeClassName}>FREE</b>
    </span>
  );
}
