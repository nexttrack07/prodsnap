import { atom, WritableAtom } from 'jotai';
import React, { SetStateAction, SVGAttributes } from 'react';

export type Action<T> = SetStateAction<T>;
export type MoveableElement = {
  width: number;
  height: number;
  opacity?: number;
}
export type SVGType = {
  type: "svg";
  props?: SVGAttributes<SVGSVGElement>;
  elements: Array<{
    tag: string;
    props: SVGAttributes<SVGCircleElement | SVGRectElement | SVGEllipseElement | SVGPolygonElement>
  }>
}
export type SVGStrokeProps = {
  clipPathId: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: "inherit" | "butt" | "round" | "square" | undefined;
  strokeDasharray: string;
};
export type SVGLineType = {
  type: "svg-line",
  props?: SVGAttributes<SVGSVGElement>;
  line:  SVGAttributes<SVGLineElement>;
  startPath?: SVGAttributes<SVGPathElement>;
  endPath?: SVGAttributes<SVGPathElement>;
}
export type SVGPathType = {
  type: "svg-path",
  props?: SVGAttributes<SVGSVGElement>;
  path: SVGAttributes<SVGPathElement>;
  strokeProps: SVGStrokeProps;
}
export type TextType = {
  type: "text";
  content: string;
  props: React.CSSProperties
}
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
}
export type CanvasElement = MoveableElement & (SVGType | ImageType | TextType | SVGPathType | SVGLineType)
export type ElementType = WritableAtom<CanvasElement, Action<CanvasElement>>
export type ElementGroup = {
  x: number;
  y: number;
  elements: ElementType[];
}
export type ElementGroupType = WritableAtom<ElementGroup, Action<ElementGroup>>;
export const elementsAtom = atom<ElementGroupType[]>([]);
export const selectedElementsAtom = atom<number[]>([]);
export function getDefaultMoveable(props?: Partial<MoveableElement>) {
  return {
    width: 200,
    height: 200,
    ...props
  }
}
export const defaultImage: ImageType & MoveableElement = {
  type: "image",
  url: "",
  state: ImageState.Normal,
  width: 400,
  height: 400,
}
