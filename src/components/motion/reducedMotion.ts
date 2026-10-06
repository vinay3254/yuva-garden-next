// Shared media queries for gsap.matchMedia. Keep every motion component on these.
export const MOTION_OK_QUERY = "(prefers-reduced-motion: no-preference)";
export const MOTION_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const MOBILE_MOTION_QUERY = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";
export const HOVER_MOTION_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference) and (hover: hover)";
