import { Box, DEFAULT_THEME } from "@mantine/core";
import { Moveable, MoveableItem } from "../moveable";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  elementByIdAtom,
  selectedElementListAtom,
  selectedItemsAtom,
} from "./store";
import { useCallback } from "react";

const positionAtom = atom(
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

const dimensionAtom = atom(
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

export function SelectHandler() {
  const [{ x, y }, setPosition] = useAtom(positionAtom);
  const [{ width, height }, setDimension] = useAtom(dimensionAtom);

  const handleElementsMove = useCallback((d: { x: number; y: number }) => {
    setPosition(d);
  }, []);

  const handleSEResize = useCallback((d: { x: number; y: number }) => {
    setDimension({ width: d.x, height: d.y });
  }, []);

  if (width === 0) return null;

  return (
    <Moveable>
      <MoveableItem onMove={handleElementsMove}>
        <Box
          sx={{
            position: "absolute",
            left: x,
            top: y,
            width,
            height,
            borderWidth: 2,
            borderColor: DEFAULT_THEME.colors.blue[6],
            borderStyle: "solid",
            cursor: "move",
          }}
        />
      </MoveableItem>
      <MoveableItem onMove={handleSEResize}>
        <Box
          sx={{
            position: "absolute",
            left: x + width,
            top: y + height,
            width: 15,
            height: 15,
            borderRadius: "100%",
            backgroundColor: DEFAULT_THEME.colors.gray[1],
            borderWidth: 1,
            borderColor: DEFAULT_THEME.colors.gray[5],
            borderStyle: "solid",
            transform: "translate(-50%, -50%)",
            cursor: "se-resize",
          }}
        />
      </MoveableItem>
    </Moveable>
  );
}
