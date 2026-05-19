"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  animate as animeAnimate,
  Timeline,
  type AnimationParams,
  type JSAnimation,
  type TargetsParam,
  type TimelineParams,
} from "animejs";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type AnimInstance = JSAnimation | Timeline;

function withNoMotionParams(
  params: AnimationParams | undefined,
): AnimationParams {
  return {
    ...params,
    duration: 0,
    delay: 0,
  };
}

export function useAnime() {
  const reducedMotion = useReducedMotion();
  const instancesRef = useRef<AnimInstance[]>([]);

  const track = useCallback((instance: AnimInstance) => {
    instancesRef.current.push(instance);
  }, []);

  const animate = useCallback(
    (targets: TargetsParam, parameters?: AnimationParams): JSAnimation => {
      const params = reducedMotion
        ? withNoMotionParams(parameters)
        : parameters;
      const animation = animeAnimate(targets, params ?? {});
      track(animation);
      return animation;
    },
    [reducedMotion, track],
  );

  const createTimeline = useCallback(
    (parameters?: TimelineParams): Timeline => {
      const params = reducedMotion
        ? {
            ...parameters,
            defaults: {
              ...parameters?.defaults,
              duration: 0,
              delay: 0,
            },
          }
        : parameters;
      const timeline = new Timeline(params);
      track(timeline);
      return timeline;
    },
    [reducedMotion, track],
  );

  const cleanup = useCallback(() => {
    for (const instance of instancesRef.current) {
      try {
        instance.revert();
      } catch {
        // ignore revert errors on already-finished animations
      }
    }
    instancesRef.current = [];
  }, []);

  useEffect(() => cleanup, [cleanup]);

  return {
    animate,
    createTimeline,
    cleanup,
    reducedMotion,
  };
}
