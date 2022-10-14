import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { SVGAttributes } from 'react'

export const elementsState = atom<number[]>({
  key: "elements",
  default: []
})

export type PositionType = {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}


export type SVGStrokeProps = {
  clipPathId: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: "inherit" | "butt" | "round" | "square" | undefined;
  strokeDasharray: string;
};
export type ShapeType = {
  type: "shape",
  props?: SVGAttributes<SVGSVGElement>;
  path: SVGAttributes<SVGPathElement>;
  strokeProps: SVGStrokeProps;
} & PositionType;


export enum ImageState {
  Loading,
  Normal,
  Cropping
}

export type ImageType = {
  type: "image";
  url: string;
  state: ImageState;
  thumbnail?: string;
  currentUrl?: string;
} & PositionType;


export type TextType = {
  type: "text";
  content: string;
  props: React.CSSProperties;
} & PositionType;

export type Element = ShapeType | ImageType | TextType;

export const elementState = atomFamily<Element, number>({
  key: "element",
  default: () => ({
    type: "text",
    content: "Heading goes here",
    x: 50,
    y: 100,
    width: 100,
    height: 100,
    props: {
      fontSize: 50
    }
  })
})

export const elementGroupsState = atom<number[][]>({
  key: "element-groups",
  default: []
})

export const selectedElementIdsState = atom<number[]>({
  key: "selected-element-ids",
  default: []
})

export const selectedGroupIdsState = atom<number[]>({
  key: "selected-group-ids",
  default: [],
})

export const isElementSelectedState = selectorFamily({
  key: "is-element-selected",
  get: (id: number) => ({ get }) => {
    const selectedElementIds = get(selectedElementIdsState);
    return selectedElementIds.includes(id);
  }
})

export const isGroupSelectedState = selectorFamily({
  key: "is-group-selected",
  get: (id: number) => ({ get }) => {
    const selectedGroupIds = get(selectedGroupIdsState);
    return selectedGroupIds.includes(id);
  }
})

export const selectedElementsAtom = selector({
  key: "selected-elements",
  get: ({ get }) => {
    return get(selectedElementIdsState).map((id) => get(elementState(id)));
  },
});

export const activeElementState = atom<number>({
  key: "active-element",
  default: -1
})
