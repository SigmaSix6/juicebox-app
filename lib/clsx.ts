/** Joins truthy class names. Tiny stand-in for the `clsx` package. */
export default function clsx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}
