import type { Metadata, Viewport } from "next";
import { bagoss, sohne } from "./fonts";
import { AppShell } from "@/components/layout/AppShell";
import { SkipLink } from "@/components/layout/SkipLink";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Juicebox — Get a reality check",
    template: "%s · Juicebox",
  },
  description:
    "Compare your thoughts on technology with current industry opinions.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0d10",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bagoss.variable} ${sohne.variable}`}>
      <body>
        <SkipLink />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
