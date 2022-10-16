import { atom, WritableAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import React, { SetStateAction, SVGAttributes } from "react";

export type Action<T> = SetStateAction<T>;
export type MoveableElement = {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
};
export type SVGType = {
  type: "svg";
  props?: SVGAttributes<SVGSVGElement>;
  elements: Array<{
    tag: string;
    props: SVGAttributes<
      SVGCircleElement | SVGRectElement | SVGEllipseElement | SVGPolygonElement
    >;
  }>;
};
export type SVGStrokeProps = {
  clipPathId: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: "inherit" | "butt" | "round" | "square" | undefined;
  strokeDasharray: string;
};
export type SVGLineType = {
  type: "svg-line";
  props?: SVGAttributes<SVGSVGElement>;
  line: SVGAttributes<SVGLineElement>;
  startPath?: SVGAttributes<SVGPathElement>;
  endPath?: SVGAttributes<SVGPathElement>;
};
export type SVGPathType = {
  type: "svg-path";
  props?: SVGAttributes<SVGSVGElement>;
  path: SVGAttributes<SVGPathElement>;
  strokeProps: SVGStrokeProps;
};
export type TextType = {
  type: "text";
  content: string;
  props: React.CSSProperties;
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
export type CanvasElement = MoveableElement &
  (SVGType | ImageType | TextType | SVGPathType | SVGLineType);
export type ElementType = WritableAtom<CanvasElement, Action<CanvasElement>>;

export const elementsAtom = atom<ElementType[]>([]);
export const selectedElementsAtom = atom<number[]>([]);
export function getDefaultMoveable(props?: Partial<MoveableElement>) {
  return {
    width: 200,
    height: 200,
    ...props,
  };
}
export const defaultImage: ImageType & MoveableElement = {
  type: "image",
  url: "",
  x: 100,
  y: 200,
  state: ImageState.Normal,
  width: 400,
  height: 400,
};

export const elementByIdAtom = atom<Record<number, ElementType>>({});
export const elementListAtom = atom<number[]>([]);
export const selectedElementListAtom = atom<number[]>([]);
export const elementGroupsAtom = atom<number[][]>([]);

export const addElementAtom = atom(null, (get, set, el: CanvasElement) => {
  const elements = get(elementListAtom);
  const newId = elements.length;

  set(elementListAtom, (ids) => [...ids, newId]);
  set(elementByIdAtom, (elMap) => ({
    ...elMap,
    [newId]: atom(el),
  }));
});

export const selectedItemsAtom = atom((get) => {
  const selectedElementIds = get(selectedElementListAtom);
  const elementById = get(elementByIdAtom);
  const selectedElementAtoms = selectedElementIds.map((id) => elementById[id]);
  const selectedElements = selectedElementAtoms.map((a) => get(a));

  return { atoms: selectedElementAtoms, elements: selectedElements };
});
