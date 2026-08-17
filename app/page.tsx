"use client";


export default function Page(){

  return (
    <div className="relative min-h-screen w-full bp-bg flex items-center justify-center overflow-hidden">
      {/* Choose What Mode The Player Wants */}

       <div className="p-10 flex flex-col gap-4 text-3xl">
      <a href="/direct" className="text-pink-400">🎮 لعب مباشر</a>
      <a href="/create-room" className="text-pink-400">🏠 إنشاء غرفة</a>
      <a href="/join-room" className="text-pink-400">🔑 الانضمام لغرفة</a>
    </div>
    </div>
  );
}
