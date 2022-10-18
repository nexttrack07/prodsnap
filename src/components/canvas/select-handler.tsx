import { atom, useAtom, useAtomValue } from "jotai";
import { selectedItemsAtom } from "./store";
import { Moveable } from "../moveable";
import { isCroppingAtom } from "../toolbar/image-toolbar";

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

export function SelectHandler() {
  const [{ x, y }, setPosition] = useAtom(positionAtom);
  const [{ width, height }, setDimension] = useAtom(dimensionAtom);
  const isCropping = useAtomValue(isCroppingAtom);

  if (isCropping) return null;

  if (width === 0) return null;

  function handleDrag(pos: { x: number; y: number }) {
    setPosition(pos);
  }

  function handleRotate(rotation: number) {
    console.log("rotate: ", rotation);
  }

  function handleResize(dimension: { width: number; height: number }) {
    setDimension({ width: dimension.width, height: dimension.height });
  }

  return (
    <Moveable
      onDrag={handleDrag}
      onResize={handleResize}
      onRotate={handleRotate}
      styleProps={{
        width,
        height,
        left: x,
        top: y,
        rotation: 0,
      }}
    />
  );
}
