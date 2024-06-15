import { useState, useRef, useEffect } from "react";

type Args = {
  initialValue?: boolean;
  scrollBehaviour?: "instant" | "smooth";
};

export const useLoading = ({
  initialValue = false,
  scrollBehaviour = "instant",
}: Args) => {
  const [loading, setLoading] = useState(initialValue);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading)
      loadingRef.current?.scrollIntoView({ behavior: scrollBehaviour });
  }, [loading]);

  return { loading, setLoading, loadingRef };
};
