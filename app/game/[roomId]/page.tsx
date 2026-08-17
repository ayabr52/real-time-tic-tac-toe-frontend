"use client";

import { useParams } from "next/navigation";
import Board from "@/components/Board";

export default function GamePage() {
  const { roomId } = useParams();

  return <Board roomId={roomId} />;
}
