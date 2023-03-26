import { atom, WritableAtom } from 'jotai';
import React, { SetStateAction, SVGAttributes } from 'react';

export type Action<T> = SetStateAction<T>;
export type Atom<T> = WritableAtom<T, Action<T>>;


export type Draggable = {
  x: number;
  y: number;
};

export type Resizable = {
  width: number;
  height: number;
};

export type MoveableElement = Draggable & Resizable & {
  group?: string;
  opacity?: number;
};

export type SVGStrokeProps = {
  clipPathId: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: 'inherit' | 'butt' | 'round' | 'square';
  strokeDasharray?: string;
};

export type SVGPointAtom = Atom<SVGPointType>;
export type SVGPointType = Draggable & { type: 'svg-point' };

export type SVGCurveWithPointAtoms = Omit<SVGCurveType, 'points'> & {
  points: SVGPointAtom[];
};

export type SVGCurveType = {
  type: 'svg-curve';
  points: SVGPointType[];
  isQuadratic?: boolean;
} & Partial<SVGStrokeProps> & {
  startMarker: 'none' | 'fill-arrow' | 'outline-arrow' | 'outline-circle';
  endMarker: 'none' | 'fill-arrow' | 'outline-arrow' | 'outline-circle';
} & MoveableElement;

export type SVGPathType = {
  type: 'svg-path';
  getViewBox: (w: number, h: number) => string;
  getPath: (w: number, h: number) => string;
  props: SVGAttributes<SVGSVGElement>;
  path: SVGAttributes<SVGPathElement>;
  strokeProps: SVGStrokeProps;
} & MoveableElement;

export type TextType = {
  type: 'text';
  content: string;
  props: React.CSSProperties;
} & MoveableElement;

export enum ImageState {
  Loading,
  Normal,
  Cropping,
}

export type ImageType = {
  type: 'image';
  url: string;
  state: ImageState;
  thumbnail?: string;
  currentUrl?: string;
} & MoveableElement;

export type CanvasElement = ImageType | TextType | SVGPathType | SVGCurveType;
export type CanvasElementWithPointAtoms = Exclude<CanvasElement, SVGCurveType> | SVGCurveWithPointAtoms;
export type ElementType = Atom<CanvasElementWithPointAtoms>;
export type GroupType = Atom<ElementType[]>;

// [atom([atom(), atom()]), atom([atom(), atom()])]
export const elementAtomsAtom = atom<ElementType[]>([]);
export const activeElementAtomAtom = atom<ElementType | null>(null);
export const selectedElementAtomsAtom = atom<ElementType[]>([]);
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

export const addElementAtom = atom(null, (_, set, newEl: CanvasElementWithPointAtoms) => {
  set(elementAtomsAtom, (elementAtoms) => [...elementAtoms, atom(newEl)]);
});

export const addElementsAtom = atom(null, (_, set, newEls: CanvasElementWithPointAtoms[]) => {
  set(elementAtomsAtom, (elementAtoms) => [...elementAtoms, ...newEls.map((newEl) => atom(newEl))]);
});

export const canvasAtom = atom({
  width: 800,
  height: 650,
  scale: 1,
  backgroundColor: 'white',
  isSelected: false
});

export const createAtom = (element: CanvasElement): ElementType => {
  if (element.type === 'svg-curve') {
    return atom({
      ...element,
      points: element.points.map((point) => atom(point))
    }) as any as ElementType;
  }

  return atom(element) as any as ElementType;
};

export const isPath = (element: CanvasElementWithPointAtoms): element is SVGPathType =>
  element && element.type === 'svg-path';
export const isImage = (element: CanvasElementWithPointAtoms): element is ImageType =>
  element && element.type === 'image';
export const isText = (element: CanvasElementWithPointAtoms): element is TextType =>
  element && element.type === 'text';
export const isCurve = (element: CanvasElementWithPointAtoms): element is SVGCurveWithPointAtoms =>
  element && element.type === 'svg-curve';
