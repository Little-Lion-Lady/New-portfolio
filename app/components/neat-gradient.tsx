"use client";

import { useEffect, useRef } from "react";
import { NeatGradient, type NeatConfig } from "@firecms/neat";

const lightColors: NeatConfig["colors"] = [
  { color: "#FF0000", enabled: true },
  { color: "#8AA7FF", enabled: true },
  { color: "#8AA7FF", enabled: true },
  { color: "#B498FF", enabled: true },
  { color: "#8AA7FF", enabled: true },
  { color: "#F2F4F8", enabled: false },
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
  backgroundColor: "#E4E4E4",
  backgroundAlpha: 0,
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
  fresnelColor: "#F2F4F8",
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
  cameraY: -15,
  cameraZ: 0,
  cameraRotationX: 0.86,
  cameraRotationY: -0.007,
  cameraRotationZ: 0,
  cameraZoom: 3.05,
};

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

  useEffect(() => {
    if (!canvasRef.current) return;

    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      ...defaultConfig,
      ...config,
    });

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
      }
    };

    applyThemeColors();

    const observer = new MutationObserver(applyThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const handleScroll = () => {
      if (gradientRef.current) {
        gradientRef.current.yOffset = window.scrollY;
      }
    };

    if (scrollReactive) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      watermarkObserver.disconnect();
      if (scrollReactive) window.removeEventListener("scroll", handleScroll);
      gradientRef.current?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
