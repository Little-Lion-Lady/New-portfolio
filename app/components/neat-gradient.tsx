"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { NeatGradient, type NeatConfig } from "@firecms/neat";

// The light/dark background literals below (#fafafa / #0a090a) MUST stay equal
// to --bg-primary in each theme (gray-light-50 / gray-dark-50 in globals.css).
// The gradient paints a solid background rather than a transparent one — a
// transparent WebGL canvas under filter:blur() gets a white fill in Firefox —
// so any drift here shows up as a seam against the page.
const lightColors: NeatConfig["colors"] = [
  { color: "#FF0000", enabled: true },
  { color: "#8AA7FF", enabled: true },
  { color: "#8AA7FF", enabled: true },
  { color: "#B498FF", enabled: true },
  { color: "#8AA7FF", enabled: true },
  { color: "#FAFAFA", enabled: false },
];

const darkColors: NeatConfig["colors"] = [
  { color: "#1A15FF", enabled: true },
  { color: "#0E0C5A", enabled: true },
  { color: "#0E0C5A", enabled: true },
  { color: "#3744FF", enabled: true },
  { color: "#0E0C5A", enabled: true },
  { color: "#0A090A", enabled: false },
];

const defaultConfig: NeatConfig = {
  colors: lightColors,
  speed: 2,
  horizontalPressure: 3,
  verticalPressure: 4,
  waveFrequencyX: 2.5,
  waveFrequencyY: 2.5,
  waveAmplitude: 6,
  shadows: 4,
  highlights: 4,
  colorBrightness: 1.05,
  colorSaturation: 2,
  wireframe: false,
  colorBlending: 5,
  backgroundColor: "#fafafa",
  backgroundAlpha: 1,
  grainScale: 4,
  grainSparsity: 0,
  grainIntensity: 0,
  grainSpeed: 0.5,
  resolution: 0.55,
  yOffset: 5526,
  yOffsetWaveMultiplier: 4,
  yOffsetColorMultiplier: 4,
  yOffsetFlowMultiplier: 10,
  flowDistortionA: 1.2,
  flowDistortionB: 1.8,
  flowScale: 1.5,
  flowEase: 0.25,
  flowEnabled: false,
  enableProceduralTexture: false,
  transparentTextureVoid: false,
  textureVoidLikelihood: 0.27,
  textureVoidWidthMin: 60,
  textureVoidWidthMax: 420,
  textureBandDensity: 1.2,
  textureColorBlending: 0.06,
  textureSeed: 333,
  textureEase: 0.5,
  proceduralBackgroundColor: "#0E0707",
  textureShapeTriangles: 20,
  textureShapeCircles: 15,
  textureShapeBars: 15,
  textureShapeSquiggles: 10,
  domainWarpEnabled: false,
  domainWarpIntensity: 0,
  domainWarpScale: 3,
  vignetteIntensity: 0,
  vignetteRadius: 0.35,
  fresnelEnabled: false,
  fresnelPower: 1.3,
  fresnelIntensity: 0,
  fresnelColor: "#FAFAFA",
  iridescenceEnabled: false,
  iridescenceIntensity: 0.8,
  iridescenceSpeed: 1.5,
  bloomIntensity: 0.2,
  bloomThreshold: 0.1,
  chromaticAberration: 3,
  shapeType: "sphere",
  shapeRotationX: -2.49,
  shapeRotationY: 0,
  shapeRotationZ: 0,
  shapeAutoRotateSpeedX: 1,
  shapeAutoRotateSpeedY: 1.2,
  sphereRadius: 21,
  torusRadius: 15,
  torusTube: 5,
  cylinderRadius: 10,
  cylinderHeight: 40,
  planeBend: 0,
  planeTwist: 0,
  silhouetteFade: 0,
  cylinderFade: 0.08,
  ribbonFade: 0.05,
  flatShading: false,
  cameraLock: false,
  cameraX: 0,
  cameraY: -17,
  cameraZ: 0,
  cameraRotationX: 0.86,
  cameraRotationY: -0.007,
  cameraRotationZ: 0,
  cameraZoom: 3.05,
};

function paintStaticFallback(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark"
    || (!document.documentElement.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  ctx.fillStyle = isDark ? "#0a090a" : "#fafafa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function NeatGradientBg({
  config = defaultConfig,
  scrollReactive = true,
  className = "",
}: {
  config?: Partial<NeatConfig>;
  scrollReactive?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<NeatGradient | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Respect prefers-reduced-motion: render a static colour instead of the
    // animated WebGL gradient. The canvas stays in the DOM so layout is unchanged.
    if (reducedMotion) {
      paintStaticFallback(canvasRef.current);
      return;
    }

    if (!canvasRef.current) return;

    try {
      gradientRef.current = new NeatGradient({
        ref: canvasRef.current,
        ...defaultConfig,
        ...config,
      });
    } catch {
      // WebGL unavailable (disabled hardware acceleration, locked-down browsers, etc).
      // Fall back to the same static fill used for reduced motion instead of crashing.
      paintStaticFallback(canvasRef.current);
      return;
    }

    // Remove the watermark link the library injects (sync + async via observer)
    const removeWatermark = (root: Element | null) => {
      root?.querySelectorAll('a[href*="firecms"], a[href*="neat"]').forEach((el) => el.remove());
    };
    removeWatermark(canvasRef.current.parentElement);

    const watermarkObserver = new MutationObserver(() => {
      removeWatermark(canvasRef.current?.parentElement ?? null);
    });
    if (canvasRef.current.parentElement) {
      watermarkObserver.observe(canvasRef.current.parentElement, { childList: true, subtree: true });
    }

    const applyThemeColors = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (gradientRef.current) {
        gradientRef.current.colors = isDark ? darkColors : lightColors;
        // Solid background matching the page avoids Firefox's white fill on
        // transparent WebGL canvases under filter:blur().
        gradientRef.current.backgroundColor = isDark ? "#0a090a" : "#fafafa";
        gradientRef.current.backgroundAlpha = 1;
      }
    };

    applyThemeColors();

    const observer = new MutationObserver(applyThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const baseYOffset = { ...defaultConfig, ...config }.yOffset ?? 0;

    const handleScroll = () => {
      if (gradientRef.current) {
        gradientRef.current.yOffset = baseYOffset + window.scrollY;
      }
    };

    if (scrollReactive) {
      // Sync immediately so the gradient never jumps on first scroll.
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      watermarkObserver.disconnect();
      if (scrollReactive) window.removeEventListener("scroll", handleScroll);
      gradientRef.current?.destroy();
    };
  // config is an object prop — changes require full teardown/reinit.
  // scrollReactive is a boolean that gates the scroll listener.
  // reducedMotion gates the entire effect body.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollReactive, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
