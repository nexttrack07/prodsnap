import { atom } from "jotai";
import { ElementAtom, ElementGroupAtom } from "./type";
import { atomFamily } from "jotai/utils";
import { sortArrayBasedOnFirst } from "@/utils";

export * from './type';
export const elementGroupAtomsAtom = atom<ElementGroupAtom[]>([]);
export const activeElementGroupAtom = atom<ElementGroupAtom | null>(null);
export const selectedElementGroupAtomsAtom = atom<ElementGroupAtom[]>([]);

export const positionAtom = atomFamily((elementAtoms: ElementAtom[]) => atom(
  (get) => {
    const elements = elementAtoms.map(el => get(el));

    const x = elements.reduce((prev, { x }) => Math.min(prev, x), Infinity);
    const y = elements.reduce((prev, { y }) => Math.min(prev, y), Infinity);

    return { x, y };
  },
  (_, set, update: { x: number; y: number }) => {
    elementAtoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        x: update.x + el.x,
        y: update.y + el.y,
      }));
    });
  }
));

export const dimensionAtom = atomFamily((elementAtoms: ElementAtom[]) => atom(
  (get) => {
    const elements = elementAtoms.map(el => get(el));
    const { x, y } = get(positionAtom(elementAtoms));

    const width = elements.reduce((prev, { x: elX, width }) => Math.max(prev, elX + width - x), 0);
    const height = elements.reduce((prev, { y: elY, height }) => Math.max(prev, elY + height - y), 0);

    return { width, height };
  },
  (get, set, update: { width: number; height: number }) => {
    elementAtoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        height: el.height + update.height,
        width: el.width + update.width,
      }));
    });
  }
));

export const combineElementGroupsAtom = atom(
  null,
  (get, set) => {
    const selectedElementGroupAtoms = get(selectedElementGroupAtomsAtom);
    const elementGroupAtoms = get(elementGroupAtomsAtom);
    const sortedSelectedElementGroupAtoms = sortArrayBasedOnFirst(elementGroupAtoms, selectedElementGroupAtoms);
    const elementGroups = sortedSelectedElementGroupAtoms.map(el => get(el));
    const elementAtoms = elementGroups.reduce((prev, { elements }) => [...prev, ...elements], [] as ElementAtom[]);
    const newGroup = {
      type: 'group' as const,
      elements: elementAtoms,
      angle: 0,
    }
    set(elementGroupAtomsAtom, (prev) => [...prev, atom(newGroup)]);
  }
)