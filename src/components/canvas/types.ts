import { PrimitiveAtom, SetStateAction, WritableAtom } from 'jotai';
import React, { SVGAttributes } from 'react';

export type Action<T> = SetStateAction<T>;
// export type Atom<T> = WritableAtom<T, Action<T>, void>;
export type Atom<T> = PrimitiveAtom<T>;
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type Position = {
  left: number;
  top: number;
};

type Dimension = {
  width: number;
  height: number;
};

type Meta = {
  position: Position;
  dimension: Dimension;
};

export interface IElement {
  type: 'path' | 'text' | 'image' | 'curve';
  meta: Meta;
  attrs: unknown;
}

export interface IPath extends IElement {
  type: 'path';
  attrs: {
    svgElement: WithRequired<SVGAttributes<SVGSVGElement>, 'stroke' | 'strokeDasharray'>;
    pathElement: SVGAttributes<SVGPathElement>;
    getViewBox: (w: number, h: number) => string;
    clipPathId: string;
    getPath: (w: number, h: number) => string;
  };
}

export interface IText extends IElement {
  type: 'text';
  attrs: {
    style: WithRequired<React.CSSProperties, 'fontSize' | 'fontFamily'>;
    content: string;
  };
}

export enum ImageState {
  Loading,
  Normal,
  Cropping
}

export interface IImage extends IElement {
  type: 'image';
  attrs: {
    url: string;
    currentUrl?: string;
    state: ImageState;
  };
}

export interface ICurve extends IElement {
  type: 'curve';
  attrs: {
    points: {
      x: number;
      y: number;
    }[];
  };
}

type TransformToAtom<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? Atom<U>[] : T[K];
};

// The derived IAtomCurve interface
export interface IAtomCurve extends IElement {
  type: 'curve';
  attrs: TransformToAtom<ICurve['attrs']>;
}

type AtomType<T extends IElement> = {
  type: CanvasItemType['type'];
  atom: Atom<T>;
};

export type CanvasItemType = IPath | IText | IImage | IAtomCurve;
export type CanvasElementType =
  | { type: 'path'; atom: Atom<IPath> }
  | { type: 'text'; atom: Atom<IText> }
  | { type: 'image'; atom: Atom<IImage> }
  | { type: 'curve'; atom: Atom<IAtomCurve> };

export const defaultImage: IImage = {
  type: 'image',
  attrs: {
    url: '',
    currentUrl: undefined,
    state: ImageState.Normal
  },
  meta: {
    position: {
      left: 100,
      top: 200
    },
    dimension: {
      width: 400,
      height: 400
    }
  }
};
