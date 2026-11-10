export interface OvalCarouselSpec {
  smallW: number;
  smallH: number;
  centerW: number;
  centerH: number;
  gap: number;
}

export interface OvalCarouselMetrics {
  stageHalf: number;
  smallW: number;
  smallH: number;
  centerW: number;
  centerH: number;
  gap: number;
  unit: number;
  extra: number;
}

export const DESKTOP_OVAL_SPEC: OvalCarouselSpec = {
  smallW: 11.5,
  smallH: 14.5,
  centerW: 21,
  centerH: 28.5,
  gap: 5.5,
};

export const TABLET_OVAL_SPEC: OvalCarouselSpec = {
  smallW: 18,
  smallH: 23,
  centerW: 34,
  centerH: 45,
  gap: 6,
};

export const MOBILE_OVAL_SPEC: OvalCarouselSpec = {
  smallW: 26,
  smallH: 33,
  centerW: 54,
  centerH: 70,
  gap: 6,
};

export const OVAL_CAROUSEL_BREAKPOINTS = {
  desktop: DESKTOP_OVAL_SPEC,
  tablet: TABLET_OVAL_SPEC,
  mobile: MOBILE_OVAL_SPEC,
};

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function computeOvalCarouselMetrics(
  spec: OvalCarouselSpec,
  viewportWidth: number,
  stageWidth: number
): OvalCarouselMetrics {
  const vwUnit = viewportWidth / 100;
  const baseUnit = spec.smallW + spec.gap;
  return {
    stageHalf: stageWidth / 2,
    smallW: spec.smallW * vwUnit,
    smallH: spec.smallH * vwUnit,
    centerW: spec.centerW * vwUnit,
    centerH: spec.centerH * vwUnit,
    gap: spec.gap * vwUnit,
    unit: baseUnit * vwUnit,
    extra: (spec.centerW / 2 + spec.gap + spec.smallW / 2 - baseUnit) * vwUnit,
  };
}

export function computeScrollProgressBar(
  wrapperWidth: number,
  totalWidth: number,
  progress: number
): { width: number; left: number } {
  if (totalWidth <= 0) return { width: 100, left: 0 };
  const width = Math.min(100, (wrapperWidth / totalWidth) * 100);
  const left = Math.max(0, Math.min(1, progress)) * (100 - width);
  return { width, left };
}

export function parseOdometerTokens(value: string): Array<{ char: string; isDigit: boolean; digit: number }> {
  return value.split('').map((char) => {
    const isDigit = /\d/.test(char);
    return {
      char,
      isDigit,
      digit: isDigit ? parseInt(char, 10) : -1,
    };
  });
}
