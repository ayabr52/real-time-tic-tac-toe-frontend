"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleCreate = async () => {
    if (!roomId.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/rooms", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name: roomId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("خطأ من السيرفر:", data);
        alert(data.message || "حدث خطأ أثناء إنشاء الغرفة");
        return;
      }

      if (data.room_name) {
        router.push(`/game/${data.room_name}`);
      } else {
        console.error("لم يتم إرجاع room_name من الباك أند", data);
      }
    } catch (error) {
      console.error("فشل الاتصال بالسيرفر:", error);
    } finally {
      setLoading(false);
    }
  };

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
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />

        <button
          disabled={loading || !roomId.trim()}
          className="mt-5 w-full p-3 bg-pink-500 text-black font-bold rounded-lg hover:bg-pink-400 transition active:scale-95 disabled:opacity-50"
          onClick={handleCreate}
        >
          {loading ? "جاري الإنشاء..." : "دخول الغرفة"}
        </button>
      </div>
    </div>
  );
}