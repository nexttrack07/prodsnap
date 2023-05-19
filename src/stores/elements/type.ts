import { SetStateAction, WritableAtom } from "jotai";
import { CSSProperties, SVGAttributes } from "react";

export type Position = {
  x: number;
  y: number;
}

export type Dimension = {
  width: number;
  height: number;
}

export type Rotation = {
  angle: number;
}

export type Path = {
  type: 'path';
  clipPathId: string;
  svgProps: SVGAttributes<SVGSVGElement>;
  pathProps: SVGAttributes<SVGPathElement>;
}

export type Text = {
  type: 'text';
  content: string;
  textProps: CSSProperties;
}

export enum ImageState {
  Loading,
  Normal,
  Cropping,
}

export type Image = {
  type: 'image';
  url: string;
  public_id?: string;
  state: ImageState;
  thumbnail?: string;
  currentUrl?: string;
  alt?: string;
  border: {
    id: 'none' | 'circle' | 'rectangle';
    stroke: string;
    strokeWidth: number;
  }
}

export type Graphic = {
  type: 'graphic';
  url: string;
  alt?: string;
}

export type Point = {
  type: 'point';
} & Position;

export type PointAtom = WritableAtom<Point, SetStateAction<Point>>;

export type Curve = {
  type: 'curve';
  points: PointAtom[];
  isQuadratic?: boolean;
  pathProps: SVGAttributes<SVGPathElement>;
  markerProps: {
    startMarker: 'none' | 'fill-arrow' | 'outline-arrow' | 'outline-circle' | 'fill-circle';
    endMarker: 'none' | 'fill-arrow' | 'outline-arrow' | 'outline-circle' | 'fill-circle';
    markerSize: number;
  };
}

export type DefaultCurve = {
  type: 'curve';
  points: Point[];
  isQuadratic?: boolean;
  pathProps: SVGAttributes<SVGPathElement>;
  markerProps: {
    startMarker: 'none' | 'fill-arrow' | 'outline-arrow' | 'outline-circle' | 'fill-circle';
    endMarker: 'none' | 'fill-arrow' | 'outline-arrow' | 'outline-circle' | 'fill-circle';
    markerSize: number;
  };
}

export type Element = (Path | Text | Curve | Image | Graphic) & Position & Dimension & Rotation;
export type ElementAtom = WritableAtom<Element, SetStateAction<Element>>;

export type ElementGroup = {
  type: 'group';
  elements: ElementAtom[];
} & Rotation;
export type ElementGroupAtom = WritableAtom<ElementGroup, SetStateAction<ElementGroup>>;