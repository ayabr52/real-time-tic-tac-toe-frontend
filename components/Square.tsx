"use client";

type SquareProps = {
  value: string | null;
  onClick: () => void;
};

export default function Square({ value, onClick }: SquareProps) {
  return (
    <button
      onClick={onClick}
      className="
    w-24 h-24 
    border border-pink-500 
    text-4xl font-bold 
    flex items-center justify-center
    bg-black/70 backdrop-blur-sm
    text-pink-400
    bp-square
    active:scale-95
  "
    >
      {value}
    </button>
  );
}
