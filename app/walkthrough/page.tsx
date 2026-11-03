import type { Metadata } from "next";
import { WalkthroughScreen } from "@/components/screens/WalkthroughScreen";

export const metadata: Metadata = { title: "How it works" };

export default function WalkthroughPage() {
  return <WalkthroughScreen />;
}
