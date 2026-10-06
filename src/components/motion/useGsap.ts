"use client";

import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "./gsap";

// Runs GSAP setup inside a context scoped to `scope`, and reverts every tween,
// ScrollTrigger and matchMedia created in it on unmount or when deps change.
export function useGsap(
  setup: () => void | (() => void),
  scope: RefObject<Element | null>,
  deps: DependencyList = []
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(setup, scope.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
