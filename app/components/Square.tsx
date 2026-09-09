"use client";

interface SquareProps {
  value: string | null;
  onClick: () => void;
}

export default function Square({ value, onClick }: SquareProps) {
  return (
    <button
      onClick={onClick}
      className="bp-square w-24 h-24 sm:w-28 sm:h-28 bg-black/70 border-2 border-pink-500/50 rounded-2xl text-5xl font-extrabold flex items-center justify-center text-pink-400 backdrop-blur-sm active:scale-95 transition"
    >
      <span className={value === "X" ? "text-pink-500 drop-shadow-[0_0_12px_rgba(255,77,166,0.8)]" : "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"}>
        {value}
      </span>
    </button>
  );
}