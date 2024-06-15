import { useRef } from "react";

export const useScrollInfo = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isAtBottom = ({
    scrollHeight,
    scrollTop,
    clientHeight,
    pixelThreshold,
  }: {
    scrollHeight: number;
    scrollTop: number;
    clientHeight: number;
    pixelThreshold: number;
  }): boolean => {
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return (
      distanceFromBottom <= pixelThreshold &&
      distanceFromBottom >= -pixelThreshold
    );
  };

  return { scrollRef, isAtBottom };
};
