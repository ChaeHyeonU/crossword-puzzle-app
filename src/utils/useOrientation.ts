import { useEffect, useState } from "react";

export function useOrientation(): "landscape" | "portrait" {
  const getOrientation = () =>
    typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches
      ? "landscape"
      : "portrait";
  const [orientation, setOrientation] = useState<"landscape" | "portrait">(() => getOrientation());

  useEffect(() => {
    const handler = () => setOrientation(getOrientation());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return orientation;
} 