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
    const selectedElements = selected.elements;
    const x = selectedElements.reduce(
      (prev, el) => Math.min(prev, el.x),
      Infinity
    );
    const y = selectedElements.reduce(
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

const dimensionAtom = atom((get) => {
  const selectedElementsAtoms = get(selectedElementListAtom).map(
    (id) => get(elementByIdAtom)[id]
  );
  const selectedElements = selectedElementsAtoms.map((a) => get(a));
  const { x, y } = get(positionAtom);
  const width = selectedElements.reduce(
    (prev, el) => Math.max(prev, el.x + (el.width ?? 0) - x),
    0
  );
  const height = selectedElements.reduce(
    (prev, el) => Math.max(prev, el.y + (el.height ?? 0) - y),
    0
  );

  return { width, height };
});

export function SelectHandler() {
  const [position, setPosition] = useAtom(positionAtom);
  const { width, height } = useAtomValue(dimensionAtom);
  const { x, y } = position;

  const handleElementsMove = useCallback((d: { x: number; y: number }) => {
    setPosition(d);
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
          }}
        />
      </MoveableItem>
    </Moveable>
  );
}
