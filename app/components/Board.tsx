"use client";

import { useState, useEffect } from "react";
import Square from "@/app/components/Square";
import echo from "@/lib/echo";

/**
 * Confetti animation when a player wins
 */
function launchConfetti() {
  const container = document.createElement("div");
  container.className = "confetti";

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.backgroundColor = ["#ff4da6", "#ff80c8", "#ffffff"][
      Math.floor(Math.random() * 3)
    ];
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2000);
}

interface BoardProps {
  roomId: string;
  initialSquares: (string | null)[];
  nextSymbol: string;
  moveData?: any;
}
export default function Board({
  roomId,
  initialSquares,
  nextSymbol,
  moveData,
}: BoardProps) {
  const [squares, setSquares] = useState(initialSquares);
  const [xIsNext, setXIsNext] = useState(nextSymbol === "X");

  // ⭐ 
  useEffect(() => {
    setSquares(initialSquares);
    setXIsNext(nextSymbol === "X");
  }, [initialSquares, nextSymbol]);

  /**
   * Calculate winner
   */
  function calculateWinner(sq) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let [a, b, c] of lines) {
      if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
        return sq[a];
      }
    }
    return null;
  }

  const winner = calculateWinner(squares);

  useEffect(() => {
    if (winner) launchConfetti();
  }, [winner]);

  useEffect(() => {
    if (!moveData) return;

    setSquares((prev) => {
      const next = [...prev];
      next[moveData.cell] = moveData.symbol;
      return next;
    });

    setXIsNext(moveData.next_symbol === "X");
  }, [moveData]);

  /**
   * Send move to backend
   */
  function handleClick(i) {
    if (squares[i] || winner) return;

    fetch(`http://127.0.0.1:8000/api/rooms/${roomId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cell: i,
        symbol: xIsNext ? "X" : "O",
      }),
    });
  }

  return (
    <div className="relative min-h-screen w-full bp-bg flex items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center bp-glow p-6 rounded-xl bg-black/40 backdrop-blur-md">
        <div className="text-pink-400 text-3xl mb-4 font-bold tracking-wide">
          {winner ? (
            <div className="winner-text text-pink-400 font-bold">
              الفائز: {winner}
            </div>
          ) : (
            <div className="text-pink-400 text-3xl font-bold">
              الدور: {xIsNext ? "X" : "O"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {squares.map((sq, i) => (
            <Square key={i} value={sq} onClick={() => handleClick(i)} />
          ))}
        </div>

        <button
          onClick={() => {
            setSquares(Array(9).fill(null));
            setXIsNext(true);
          }}
          className="mt-6 text-pink-400 text-3xl font-bold hover:text-pink-500 transition active:scale-90"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
