"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const EchoContext = createContext<Echo | null>(null);

export function EchoProvider({ children }: { children: React.ReactNode }) {
  const [echo, setEcho] = useState<Echo | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).Pusher = Pusher;
    }

    const e = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "local",
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "127.0.0.1",
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
    });

    setEcho(e);

    return () => {
      e.disconnect();
    };
  }, []);

  return (
    <EchoContext.Provider value={echo}>
      {children}
    </EchoContext.Provider>
  );
}

export function useEcho() {
  return useContext(EchoContext);
}