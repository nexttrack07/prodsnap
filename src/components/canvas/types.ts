import {  WritableAtom } from 'jotai';
import React, { SVGAttributes, SetStateAction } from 'react';

export type Action<T> = SetStateAction<T>;
export type Atom<T> = WritableAtom<T, SetStateAction<T>, void>;
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
  left: number;
  top: number;
  width: number;
  height: number;
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
    path: SVGAttributes<SVGPathElement>;
    startMarker: 'none' | 'outline-arrow' | 'fill-arrow' | 'outline-circle';
    endMarker: 'none' | 'outline-arrow' | 'fill-arrow' | 'outline-circle';
    isQuadratic?: boolean;
  };
  points: {
    x: number;
    y: number;
  }[];
}

// The derived IAtomCurve interface
export interface IAtomCurve extends IElement {
  type: 'curve';
  attrs: {
    path: SVGAttributes<SVGPathElement>;
    startMarker: 'none' | 'outline-arrow' | 'fill-arrow' | 'outline-circle';
    endMarker: 'none' | 'outline-arrow' | 'fill-arrow' | 'outline-circle';
    isQuadratic?: boolean;
  };
  points: Atom<{x: number; y: number}>[]
}

export type CanvasItemType = IPath | IText | IImage | IAtomCurve;
export type CanvasElementType = Atom<CanvasItemType>;

export const defaultImage: IImage = {
  type: 'image',
  attrs: {
    url: '',
    currentUrl: undefined,
    state: ImageState.Normal
  },
  left: 100,
  top: 200,
  width: 400,
  height: 400
};
