import localFont from "next/font/local";

/** Bagoss Standard Regular — headings and chat prompts. */
export const bagoss = localFont({
  src: "./fonts/Bagoss-StandardRegular.woff",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-bagoss",
});

/** Söhne Buch — body copy, buttons, inputs, captions. */
export const sohne = localFont({
  src: "./fonts/Sohne-Buch.woff",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-sohne",
});
