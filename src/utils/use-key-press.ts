import { useEffect, useState } from "react";

export function useKeyPress(targetKey: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === targetKey) setKeyPressed(true);
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === targetKey) setKeyPressed(false);
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, [])

  return keyPressed;
}
