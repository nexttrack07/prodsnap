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

export type Element = (Path | Text) & Position & Dimension & Rotation;
export type ElementAtom = WritableAtom<Element, SetStateAction<Element>>;

export type ElementGroup = {
  type: 'group';
  elements: ElementAtom[];
} & Rotation;
export type ElementGroupAtom = WritableAtom<ElementGroup, SetStateAction<ElementGroup>>;