import React from 'react';
import { atom, useAtom, useAtomValue } from "jotai";
import { selectedItemsAtom } from "./store";
import { isCroppingAtom } from "../toolbar/image-toolbar";
import { useCallback, useRef, useState } from "react";
import { useMantineTheme } from "@mantine/core";
import { useEventListener } from "../../utils";

export const positionAtom = atom(
  (get) => {
    const selected = get(selectedItemsAtom);
    const x = selected.elements.reduce(
      (prev, el) => Math.min(prev, el.x),
      Infinity
    );
    const y = selected.elements.reduce(
      (prev, el) => Math.min(prev, el.y),
      Infinity
    );

    return { x, y };
  },
  (get, set, update: { x: number; y: number }) => {
    const selected = get(selectedItemsAtom);
    selected.atoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        x: update.x + el.x,
        y: update.y + el.y,
      }));
    });
  }
);

export const dimensionAtom = atom(
  (get) => {
    const selected = get(selectedItemsAtom);
    const { x, y } = get(positionAtom);
    const width = selected.elements.reduce(
      (prev, el) => Math.max(prev, el.x + el.width - x),
      0
    );
    const height = selected.elements.reduce(
      (prev, el) => Math.max(prev, el.y + el.height - y),
      0
    );

    return { width, height };
  },
  (get, set, { width, height }: { width: number; height: number }) => {
    const selected = get(selectedItemsAtom);
    selected.atoms.forEach((elementAtom) => {
      set(elementAtom, (el) => {
        return {
          ...el,
          height: el.height + height,
          width: el.width + width,
        };
      });
    });
  }
);

export function DragHandler() {
  const [{ x, y }, setPosition] = useAtom(positionAtom);
  const [{ width, height }] = useAtom(dimensionAtom);
  const isCropping = useAtomValue(isCroppingAtom);
  const selected = useAtomValue(selectedItemsAtom);
  const documentRef = useRef<Document>(document);
  const theme = useMantineTheme();
  const [moving, setMoving] = useState(false);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setMoving(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMoving(true);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    if (moving) {
      setPosition({ x: e.movementX, y: e.movementY });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }


  useEventListener("pointerup", handleMouseUp, documentRef);
  useEventListener("pointermove", handleMouseMove, documentRef, [moving]);

  if (isCropping) return null;

  if (width === 0) return null;

  if (selected.elements.length < 2) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        height: height,
        width: width,
        userSelect: "none",
        cursor: 'move',
      }}
      id="moveable"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div
        style={{
          position: "absolute",
          border: `2px dashed ${theme.colors.blue[6]}`,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: "scale(1.03)",
          borderRadius: 3
        }}>
      </div>
    </div>
  );
}
