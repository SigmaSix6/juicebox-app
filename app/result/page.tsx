import type { Metadata } from "next";
import { ResultScreen } from "@/components/screens/ResultScreen";

export const metadata: Metadata = { title: "Thanks" };

export default function ResultPage() {
  return <ResultScreen />;
}
