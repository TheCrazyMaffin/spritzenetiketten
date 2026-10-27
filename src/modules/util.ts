
/**
 * Polyfill
 */
export function getOrInsert<K, V>(map: Map<K, V>, key: K, value: V) {
  if (map.has(key)) {
    return map.get(key)!
  } else {
    map.set(key, value)
    return value
  }
}

export function isObject(testItem: any) {
  return (testItem !== undefined && testItem !== null && typeof testItem === "object" && !Array.isArray(testItem))
}


/**
 * Given a type T makes all keys K of that type required. 
 */
export type MakeRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

export type RenderingContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

/**
 * Parses user input into a number. Returns undefined for empty or invalid input.
 */
export function parseNumber(value: string | number | null | undefined) {
  const number = typeof value === "number" ? value : parseFloat(value ?? "")
  return Number.isFinite(number) ? number : undefined
}

let colorContext: OffscreenCanvasRenderingContext2D | null = null

/**
 * Converts any CSS color (e.g. "yellow", "rgb(0, 140, 204)") to "#rrggbb" as required by `<input type="color">`.
 * Alpha is dropped. Invalid colors result in black.
 */
export function colorToHex(color: string | null | undefined) {
  colorContext ??= new OffscreenCanvas(1, 1).getContext("2d")
  if (!colorContext || !color) return "#000000"
  colorContext.fillStyle = "#000000"
  colorContext.fillStyle = color
  // fillStyle is normalized to "#rrggbb" for opaque colors and "rgba(r, g, b, a)" otherwise.
  const normalized = String(colorContext.fillStyle)
  if (normalized.startsWith("#")) return normalized
  const [r, g, b] = normalized.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0]
  return "#" + [r, g, b].map(channel => channel.toString(16).padStart(2, "0")).join("")
}
