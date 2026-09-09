"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (!roomId.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/rooms/join", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name: roomId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "الغرفة غير موجودة أو متعذرة");
        return;
      }

      if (data.room_name) {
        router.push(`/game/${data.room_name}`);
      }
    } catch (error) {
      console.error("فشل الانضمام للغرفة:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bp-bg flex items-center justify-center overflow-hidden dir-rtl">
      <div className="relative z-10 flex flex-col items-center bp-glow p-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl w-full max-w-md">
        
        <h1 className="text-pink-400 text-3xl mb-6 font-bold tracking-wide">
          الانضمام لغرفة
        </h1>

        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="اكتب اسم الغرفة..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/60 border border-pink-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition text-center text-lg"
          />

          <button
            onClick={handleJoin}
            disabled={loading || !roomId.trim()}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/40 text-white font-bold rounded-lg transition active:scale-95 shadow-lg shadow-pink-500/20"
          >
            {loading ? "جاري الانضمام..." : "دخول الغرفة ➔"}
          </button>
        </div>

      </div>
    </div>
  );
}