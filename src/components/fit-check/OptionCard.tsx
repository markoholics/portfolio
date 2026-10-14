"use client";

export default function OptionCard({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-cursor-hover
      aria-pressed={selected}
      className={`w-full text-left border hairline rounded-none px-6 py-5 text-base md:text-lg text-mist transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        selected ? "bg-white text-black border-white" : "bg-transparent hover:border-white/60"
      }`}
    >
      {label}
    </button>
  );
}
