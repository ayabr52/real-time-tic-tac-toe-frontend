"use client";

export default function Square({ value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-24 h-24 border border-pink-500 text-4xl font-bold flex items-center justify-center hover:bg-pink-500/20 transition"
    >
      {value}
    </button>
  );
}
