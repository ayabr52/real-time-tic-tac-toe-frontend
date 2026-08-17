"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full bp-bg flex items-center justify-center overflow-hidden">

      <div className="relative z-10 flex flex-col items-center bp-glow p-8 rounded-xl bg-black/40 backdrop-blur-md w-[350px]">

        <h1 className="text-pink-400 text-3xl font-bold mb-6 tracking-wide">
          إنشاء غرفة
        </h1>

        <input
          className="w-full p-3 rounded-lg bg-black/60 border border-pink-500 text-pink-300 placeholder-pink-400 focus:outline-none focus:border-pink-400"
          placeholder="اكتب اسم الغرفة"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button
          className="mt-5 w-full p-3 bg-pink-500 text-black font-bold rounded-lg hover:bg-pink-400 transition active:scale-95"
          onClick={() => router.push(`/game/${roomId}`)}
        >
          دخول الغرفة
        </button>

      </div>

    </div>
  );
}
