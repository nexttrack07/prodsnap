import { Box, DEFAULT_THEME } from "@mantine/core";
import { atom, useAtomValue } from "jotai";
import { elementByIdAtom, selectedElementListAtom } from "./store";

const positionAtom = atom((get) => {
  const selectedElementsAtoms = get(selectedElementListAtom).map(
    (id) => get(elementByIdAtom)[id]
  );
  const selectedElements = selectedElementsAtoms.map((a) => get(a));
  const x = selectedElements.reduce(
    (prev, el) => Math.min(prev, el.x),
    Infinity
  );
  const y = selectedElements.reduce(
    (prev, el) => Math.min(prev, el.y),
    Infinity
  );

  return { x, y };
});

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
  const { x, y } = useAtomValue(positionAtom);
  const { width, height } = useAtomValue(dimensionAtom);

  if (width === 0) return null;

  return (
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
  );
}
