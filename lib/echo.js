import Echo from "laravel-echo";

let echo = null;

if (typeof window !== "undefined") {
  echo = new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT,
    forceTLS: false,
    encrypted: false,
    disableStats: true,
  });
}

export { echo };
