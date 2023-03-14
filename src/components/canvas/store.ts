import { atom, WritableAtom } from 'jotai';
import React, { SetStateAction, SVGAttributes } from 'react';

export type Action<T> = SetStateAction<T>;
export type Draggable = {
  x: number;
  y: number;
};

export type Resizable = {
  width: number;
  height: number;
};

export type MoveableElement = Draggable &
  Resizable & {
    group?: string;
    opacity?: number;
  };
export type SVGType = {
  type: 'svg';
  props?: SVGAttributes<SVGSVGElement>;
  elements: Array<{
    tag: string;
    props: SVGAttributes<SVGCircleElement | SVGRectElement | SVGEllipseElement | SVGPolygonElement>;
  }>;
};
export type SVGStrokeProps = {
  clipPathId: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'inherit' | 'butt' | 'round' | 'square' | undefined;
  strokeDasharray: string;
};
export type SVGLineType = {
  type: 'svg-line';
  start: SVGPointAtom;
  end: SVGPointAtom;
  strokeProps: Partial<SVGStrokeProps>;
};
export type SVGPointType = {
  type: 'svg-point';
};

export type SVGPointAtom = WritableAtom<SVGPointType & Draggable, Action<SVGPointType & Draggable>>

export type SVGCurveType = {
  type: 'svg-curve';
  points: SVGPointAtom[];
  clipPathId?: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: 'inherit' | 'butt' | 'round' | 'square' | undefined;
  strokeDasharray?: string;
  startMarker: "none" | "fill-arrow" | "outline-arrow" | "outline-circle";
  endMarker: "none" | "fill-arrow" | "outline-arrow" | "outline-circle";
};
export type SVGPathType = {
  type: 'svg-path';
  getViewBox: (w: number, h: number) => string;
  getPath: (w: number, h: number) => string;
  props?: SVGAttributes<SVGSVGElement>;
  path: SVGAttributes<SVGPathElement>;
  strokeProps: SVGStrokeProps;
};
export type TextType = {
  type: 'text';
  content: string;
  props: React.CSSProperties;
};
export enum ImageState {
  Loading,
  Normal,
  Cropping
}
export type ImageType = {
  type: 'image';
  url: string;
  state: ImageState;
  thumbnail?: string;
  currentUrl?: string;
};

export type CanvasElement = MoveableElement &
  (SVGType | ImageType | TextType | SVGPathType | SVGLineType | SVGCurveType);
export type ElementType = WritableAtom<CanvasElement, Action<CanvasElement>>;
export type GroupType = WritableAtom<ElementType[], Action<ElementType[]>>;

// [atom([atom(), atom()]), atom([atom(), atom()])]
export const elementAtomsAtom = atom<ElementType[]>([]);
export const selectedElementAtomsAtom = atom<ElementType[]>([]);
export const activeElementAtomAtom = atom<ElementType | null>(null);
export const groupsByIdAtom = atom<Record<string, ElementType[]>>({});

export function getDefaultMoveable(props?: Partial<MoveableElement>) {
  return {
    width: 200,
    height: 200,
    ...props
  };
}

export const defaultImage: ImageType & MoveableElement = {
  type: 'image',
  url: '',
  x: 100,
  y: 200,
  state: ImageState.Normal,
  width: 400,
  height: 400
};

export const selectedItemsAtom = atom((get) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  const selectedElements = selectedElementAtoms.map((elementAtom) => get(elementAtom));

  return {
    elements: selectedElements,
    atoms: selectedElementAtoms
  };
});

export const addElementAtom = atom(null, (_, set, newEl: CanvasElement) => {
  set(elementAtomsAtom, (elementAtoms) => [...elementAtoms, atom(newEl)]);
});

export const addElementsAtom = atom(null, (_, set, newEls: CanvasElement[]) => {
  set(elementAtomsAtom, (elementAtoms) => [...elementAtoms, ...newEls.map((newEl) => atom(newEl))]);
});

export const canvasAtom = atom({
  width: 900,
  height: 750,
  scale: 1,
  backgroundColor: 'white'
})