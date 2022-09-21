import { atom, WritableAtom } from 'jotai';
import { SetStateAction, SVGAttributes } from 'react';

export type Action<T> = SetStateAction<T>;

export type MoveableElement = {
  width: number;
  height: number;
  x: number;
  y: number;
}

export type SVGType = {
  type: "svg";
  elements: Array<{
    tag: string;
    props: SVGAttributes<SVGCircleElement | SVGRectElement | SVGEllipseElement | SVGPolygonElement>
  }>
}

export type ImageType = {
  type: "image";
  url: string;
  thumbnail?: string;
}

export type CanvasElement = MoveableElement & (SVGType | ImageType)

export type ElementType = WritableAtom<CanvasElement, Action<CanvasElement>>

function getRandomInt(min: number = 100, max: number = 500) {
  const n = Math.ceil(min);
  const x = Math.floor(max);
  return Math.floor(Math.random() * (x - n + 1)) + n;
}

export const elementsAtom = atom<ElementType[]>([]);
export const selectedElementsAtom = atom<number[]>([]);
