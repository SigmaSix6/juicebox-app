import type { Metadata } from "next";
import { AboutYouForm } from "@/components/form/AboutYouForm";

export const metadata: Metadata = { title: "About you" };

export default function FormPage() {
  return <AboutYouForm />;
}
