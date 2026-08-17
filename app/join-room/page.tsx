"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!roomId.trim()) return;
    router.push(`/game/${roomId}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>الانضمام لغرفة</h1>

      <input
        type="text"
        placeholder="اكتب اسم الغرفة"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ padding: 10, marginTop: 20 }}
      />

      <button
        onClick={handleJoin}
        style={{ padding: 10, marginLeft: 10 }}
      >
        دخول الغرفة
      </button>
    </div>
  );
}
