import { atom, atomFamily } from "recoil";

export const elementsState = atom<number[]>({
  key: "elements",
  default: [],
});

export type PositionType = {
  x: number;
  y: number;
};

export type ShapeType = {
  type: "shape";
  width: number;
  height: number;
  d: string;
};

export enum ImageState {
  Loading,
  Normal,
  Cropping,
}

export type ImageType = {
  type: "image";
  url: string;
  state: ImageState;
  thumbnail?: string;
  currentUrl?: string;
};

export type TextType = {
  type: "text";
  content: string;
  props: React.CSSProperties;
};

export type Element = ShapeType | ImageType | TextType;

export const elementState = atomFamily<Element, number>({
  key: "element",
  default: () => ({
    type: "text",
    content: "Heading goes here",
    props: {
      fontSize: 50,
    },
  }),
});

export const elementGroupState = atomFamily<number[], number>({
  key: "element-group",
  default: () => [],
});
