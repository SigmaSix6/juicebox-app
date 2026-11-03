/**
 * The juicebox wordmark, assembled from the vector pieces exported from
 * Figma at their exact positions inside the 123×29 frame
 * (insets are top / right / bottom / left, in %).
 */
const PIECES: Array<[file: string, inset: string]> = [
  ["logo-1.svg", "28.1% 78.99% 18.49% 8.85%"],
  ["logo-2.svg", "28.1% 72.14% 19.83% 23.63%"],
  ["logo-3.svg", "0% 71.71% 78.42% 23.19%"],
  ["logo-4.svg", "26.76% 57.12% 18.49% 29.74%"],
  ["logo-5.svg", "26.76% 43% 18.49% 43.86%"],
  ["logo-6.svg", "26.76% 13.3% 18.49% 73.45%"],
  ["logo-7.svg", "28.1% 0% 19.83% 87.04%"],
  ["logo-8.svg", "28.21% 93.61% 0% 0%"],
  ["logo-9.svg", "0.11% 93.32% 78.31% 1.57%"],
  ["logo-10.svg", "1.79% 27.71% 18.49% 58.72%"],
];

export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="juicebox"
      className={`relative block h-7.25 w-30.75 flex-none ${className ?? ""}`}
    >
      {/* Each wrapper is placed with the Figma insets; the SVG fills it
          (the exported SVGs use preserveAspectRatio="none"). */}
      {PIECES.map(([file, inset]) => (
        <span key={file} className="absolute block" style={{ inset }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/figma/${file}`} alt="" className="size-full max-w-none" />
        </span>
      ))}
    </span>
  );
}
