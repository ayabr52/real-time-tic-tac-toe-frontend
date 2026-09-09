import Echo from "laravel-echo";

let echo: Echo | null = null;

if (typeof window !== "undefined") {
  echo = new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) ?? 8080,
    forceTLS: false,
    encrypted: false,
    disableStats: true,
  });

  console.log("Echo (Reverb):", echo);
}

export default echo;
