"use client";

import { useState } from "react";
import { useEffect } from "react";
import Square from "@/components/Square";
import { echo } from "@/lib/echo";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
// Confetti On Win
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

export default function Board({ roomId }) {
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null),
  );
  const [xIsNext, setXIsNext] = useState(true);

  function calculateWinner(squares: (string | null)[]) {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a]; // X أو O
      }
    }
    return null;
  }

  const winner = calculateWinner(squares);
  useEffect(() => {
    if (winner) {
      launchConfetti();
    }
  }, [winner]);

  function handleClick(i: number) {
    if (squares[i] || winner) return;

    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);

    if (roomId) {
      fetch("http://127.0.0.1:8000/api/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          index: i,
          player: xIsNext ? "X" : "O",
        }),
      });
    }
  }

  {
    /** Find If There is a Channel */
  }
  useEffect(() => {
    if (!roomId) return;

    console.log("listening on room:", roomId);

    const channel = echo.channel(`room.${roomId}`);

    channel.listen("MovePlayed", (data) => {
      console.log("EVENT RECEIVED:", data);

      setSquares((prev) => {
        const next = [...prev];
        next[data.index] = data.player;
        return next;
      });
    });

    return () => {
      echo.leave(`room.${roomId}`);
    };
  }, [roomId]);

  return (
    <div className="relative min-h-screen w-full bp-bg flex items-center justify-center overflow-hidden">
      {/* اللعبة */}
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
          className="
    mt-6 
    text-pink-400 
    text-4xl 
    font-bold 
    hover:text-pink-500 
    transition 
    active:scale-90
  "
        >
          ↻
        </button>
      </div>
    </div>
  );
}
