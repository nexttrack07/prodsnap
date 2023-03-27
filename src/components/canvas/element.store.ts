import { atom, WritableAtom } from 'jotai';
import React, { SVGAttributes, SetStateAction } from "react";


export type Action<T> = SetStateAction<T>;
export type Atom<T> = WritableAtom<T, Action<T>>;

type Position = {
  left: number;
  top: number;
}

type Dimension = {
  width: number;
  height: number;
}

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

type Meta = {
  position: Position;
  dimension: Dimension;
}

export interface IElement {
  type: 'path' | 'text' | 'image' | 'curve';
  meta: Meta;
  attrs: unknown;
}

export interface IPath extends IElement {
  type: 'path';
  meta: Meta;
  attrs: {
    svgElement: WithRequired<SVGAttributes<SVGSVGElement>, 'stroke' | 'strokeDasharray'>;
    pathElement: SVGAttributes<SVGPathElement>;
  };
}

export interface IText extends IElement {
  type: 'text';
  meta: Meta;
  attrs: {
    style: WithRequired<React.CSSProperties, 'fontSize' | 'fontFamily'>;
  };
}

export interface IImage extends IElement {
  type: 'image';
  meta: Meta;
  attrs: {
    src: string;
  };
}

export interface ICurve extends IElement {
  type: 'curve';
  meta: Meta;
  attrs: {
    points: {
      x: number;
      y: number;
    }[]
  };
}

type TransformToAtom<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? Atom<U>[] : T[K];
};

// The derived IAtomCurve interface
export interface IAtomCurve extends IElement {
  type: 'curve';
  meta: Meta;
  attrs: TransformToAtom<ICurve['attrs']>;
}

type AtomType<T extends IElement> = {
  type: T['type'];
  atom: Atom<T>;
}

export type CanvasElementType = AtomType<IPath> | AtomType<IText> | AtomType<IImage> | AtomType<IAtomCurve>;

export const elementsAtom = atom<CanvasElementType[]>([]);
export const selectedElementsAtom = atom<CanvasElementType[]>([]);
export const activeElementAtom = atom<CanvasElementType | null>(null);
export const groupsByIdAtom = atom<{ [key: string]: CanvasElementType[] }>({});