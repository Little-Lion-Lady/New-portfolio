// Shared Lottie color-remapping utilities used by HeroCat and AboutCat.
// Each cat supplies its own DARK_MAP; everything else is identical.

export type ColorTriplet = [number, number, number];
export type ColorMap = Array<[ColorTriplet, ColorTriplet]>;

/** Convert a 6-digit hex string to a normalised [r, g, b] triplet (0–1). */
export function hex(h: string): ColorTriplet {
  return [
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255,
  ];
}

export function matchColor(
  arr: number[],
  src: ColorTriplet,
  tol = 0.008,
): boolean {
  return (
    Math.abs(arr[0] - src[0]) < tol &&
    Math.abs(arr[1] - src[1]) < tol &&
    Math.abs(arr[2] - src[2]) < tol
  );
}

function swapColor(arr: number[], map: ColorMap): number[] {
  for (const [src, dst] of map) {
    if (matchColor(arr, src)) {
      return arr.length === 4 ? [dst[0], dst[1], dst[2], arr[3]] : [...dst];
    }
  }
  return arr;
}

function remapColorProp(
  c: Record<string, unknown>,
  map: ColorMap,
): Record<string, unknown> {
  const animated = c["a"];
  const k = c["k"];

  if (!animated && Array.isArray(k) && k.length >= 3) {
    return { ...c, k: swapColor(k as number[], map) };
  }

  if (animated && Array.isArray(k)) {
    return {
      ...c,
      k: k.map((kf) => {
        if (
          kf &&
          typeof kf === "object" &&
          Array.isArray((kf as Record<string, unknown>)["s"])
        ) {
          return {
            ...kf,
            s: swapColor((kf as Record<string, unknown>)["s"] as number[], map),
          };
        }
        return kf;
      }),
    };
  }

  return c;
}

/** Recursively walk Lottie JSON and remap every colour found under `c` keys. */
export function remapColors(obj: unknown, map: ColorMap): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => remapColors(item, map));

  const node = obj as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const key of Object.keys(node)) {
    if (key === "c" && node[key] && typeof node[key] === "object") {
      out[key] = remapColorProp(node[key] as Record<string, unknown>, map);
    } else {
      out[key] = remapColors(node[key], map);
    }
  }
  return out;
}

/**
 * Returns true if the page is currently in dark mode.
 * Checks data-theme first (set by ThemeToggle), falls back to
 * prefers-color-scheme so the answer is correct even before ThemeToggle mounts.
 */
export function isDarkTheme(): boolean {
  if (typeof window === "undefined") return false;
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme) return theme === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
