"use client";

/**
 * @file GamePage Component
 * @module app/game/[roomId]/page
 * @description Main interactive game board component for online real-time Tic-Tac-Toe.
 * Handles game state fetching, optimistic updates, WebSocket event listening via Laravel Echo,
 * win detection triggering visual effects, and room management (reset/destroy).
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEcho } from "@/app/providers/EchoProvider";
import Square from "@/app/components/Square";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://real-time-tic-tac-toe-backend-w1o4.onrender.com/api';


/**
 * Triggers a 2-second visual confetti celebration on the DOM when a player wins.
 *
 * @function launchConfetti
 * @returns {void}
 */
function launchConfetti(): void {
  if (typeof document === "undefined") return;

  const container = document.createElement("div");
  container.className = "confetti";

  // Generate 40 confetti pieces with randomized positions and delays
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = ["#ff4da6", "#ff80c8", "#ffffff"][
      Math.floor(Math.random() * 3)
    ];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    container.appendChild(piece);
  }

  document.body.appendChild(container);

  // Cleanup DOM element after animation completes
  setTimeout(() => container.remove(), 2000);
}

/**
 * Evaluates the current 9-cell board array to determine if there is a winning combination.
 *
 * @function calculateWinner
 * @param {(string | null)[]} sq - Current state of the game board array.
 * @returns {string | null} Winning symbol ("X" or "O"), or null if no winner exists yet.
 */
function calculateWinner(sq: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return sq[a];
    }
  }
  return null;
}

export default function GamePage() {
  const echo = useEcho();
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  // Game state Management
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentSymbol, setCurrentSymbol] = useState<string>("X");
  const [loading, setLoading] = useState<boolean>(false);

  // Derived winner state
  const winner = calculateWinner(squares);

  /**
   * Trigger confetti celebration upon detecting a winner.
   */
  useEffect(() => {
    if (winner) launchConfetti();
  }, [winner]);

  /**
   * Fetch initial game room state from backend on component mount.
   */
  useEffect(() => {
    if (!roomId) return;

    const fetchRoomState = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();

        if (res.ok) {
          setSquares(data.squares);
          setCurrentSymbol(data.next_symbol);
        }
      } catch (err) {
        console.error("[GamePage] Failed to fetch room state:", err);
      }
    };

    fetchRoomState();
  }, [roomId]);

  /**
   * Subscribe to Laravel Echo / Reverb WebSocket channel for real-time moves and resets.
   */
  useEffect(() => {
    if (!echo || !roomId) return;

    const channel = echo.channel(`game.${roomId}`);

    channel.listen(
      ".MovePlayed",
      (data: { cell: number; symbol: string; next_symbol: string }) => {
        // Handle full game reset event
        if (data.symbol === "RESET" || data.cell === -1) {
          setSquares(Array(9).fill(null));
          setCurrentSymbol("X");
        } else {
          // Sync incoming move from opponent
          setSquares((prev) => {
            const newBoard = [...prev];
            newBoard[data.cell] = data.symbol;
            return newBoard;
          });
          setCurrentSymbol(data.next_symbol);
        }
      }
    );

    return () => {
      channel.stopListening(".MovePlayed");
    };
  }, [echo, roomId]);

  /**
   * Handles user clicks on board cells with optimistic UI updates & rollback on failure.
   *
   * @async
   * @function handleClick
   * @param {number} i - The target cell index (0-8).
   */
  const handleClick = async (i: number) => {
    if (squares[i] || winner || loading) return;

    setLoading(true);

    // Optimistic UI Update for zero latency
    const nextSquares = [...squares];
    nextSquares[i] = currentSymbol;
    setSquares(nextSquares);

    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ cell: i, symbol: currentSymbol }),
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentSymbol(currentSymbol === "X" ? "O" : "X");
      } else {
        alert(data.error || "حركة غير صالحة");
        // Rollback optimistic update on error
        nextSquares[i] = null;
        setSquares([...nextSquares]);
      }
    } catch (err) {
      console.error("[GamePage] Error committing move:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dispatches a request to reset the game board for all players.
   *
   * @async
   * @function handleReset
   */
  const handleReset = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/reset`, {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setSquares(Array(9).fill(null));
        setCurrentSymbol("X");
      }
    } catch (err) {
      console.error("[GamePage] Failed to reset game:", err);
    }
  };

  /**
   * Permanently deletes the room on backend and redirects user home.
   *
   * @async
   * @function handleLeaveAndDestroy
   */
  const handleLeaveAndDestroy = async () => {
    try {
      await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      router.push("/");
    } catch (err) {
      console.error("[GamePage] Error destroying room:", err);
    }
  };

  return (
    <div className="relative min-h-screen w-full bp-bg flex items-center justify-center overflow-hidden p-4">
      <div className="relative z-10 flex flex-col items-center bp-glow p-6 sm:p-8 rounded-2xl bg-black/50 backdrop-blur-md border border-pink-500/20 max-w-md w-full">
        {/* اسم الغرفة بحجم أكبر وافتراضي ممتاز */}
        <h2 className="text-pink-300/80 text-base sm:text-lg tracking-wider mb-3 uppercase font-medium">
          غرفة: <span className="font-extrabold text-pink-400 text-lg sm:text-xl">{roomId}</span>
        </h2>

        {/* النص الخاص بالفائز والدور بحجم بارز جداً */}
        <div className="text-pink-400 mb-6 font-bold tracking-wide min-h-[48px] flex items-center justify-center">
          {winner ? (
            <div className="winner-text text-3xl sm:text-4xl text-pink-400 font-black drop-shadow-[0_0_12px_rgba(255,77,166,0.9)]">
              🎉 الفائز: {winner}
            </div>
          ) : (
            <div className="text-2xl sm:text-3xl font-bold">
              الدور: <span className="text-pink-300 font-black text-3xl sm:text-4xl">{currentSymbol}</span>
            </div>
          )}
        </div>

        {/* 3x3 Interactive Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full aspect-square">
          {squares.map((sq, i) => (
            <Square key={i} value={sq} onClick={() => handleClick(i)} />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 items-center mt-6 w-full justify-center">
          <button
            onClick={handleReset}
            title="إعادة اللعبة"
            className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-xl text-lg font-bold transition active:scale-95 flex items-center gap-1"
          >
            ↻ إعادة
          </button>

          <button
            onClick={handleLeaveAndDestroy}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-lg font-bold transition active:scale-95"
          >
            إنهاء الغرفة ✕
          </button>
        </div>
      </div>
    </div>
  );
}