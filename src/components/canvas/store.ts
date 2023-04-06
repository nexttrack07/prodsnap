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

export type MoveableElement = Draggable &
  Resizable & {
    group?: string;
    opacity?: number;
  };

export type SVGStrokeProps = {
  clipPathId: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: 'inherit' | 'butt' | 'round' | 'square';
  strokeDasharray?: string;
  strokeLinejoin?: 'inherit' | 'miter' | 'round' | 'bevel';
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
    startMarker: 'none' | 'fill-arrow' | 'outline-arrow' | 'outline-circle' | 'fill-circle';
    endMarker: 'none' | 'fill-arrow' | 'outline-arrow' | 'outline-circle' | 'fill-circle';
    markerSize: number;
  } & MoveableElement;

export type SVGPathType = {
  type: 'svg-path';
  props: SVGAttributes<SVGSVGElement>;
  path: SVGAttributes<SVGPathElement>;
  strokeProps: SVGStrokeProps;
} & MoveableElement;

export type SVGGraphicType = {
  name:
    | 'svg'
    | 'g'
    | 'path'
    | 'circle'
    | 'ellipse'
    | 'line'
    | 'polyline'
    | 'polygon'
    | 'rect'
    | 'text'
    | 'textPath'
    | 'tspan'
    | 'use'
    | 'symbol'
    | 'defs'
    | 'linearGradient'
    | 'radialGradient'
    | 'stop'
    | 'clipPath'
    | 'mask'
    | 'pattern'
    | 'marker'
    | 'foreignObject'
    | 'image'
    | 'view'
    | 'a'
    | 'switch'
    | 'style'
    | 'script'
    | 'desc'
    | 'title'
    | 'metadata'
    | 'filter'
    | 'feBlend'
    | 'feColorMatrix'
    | 'feComponentTransfer'
    | 'feComposite'
    | 'feConvolveMatrix'
    | 'feDiffuseLighting'
    | 'feDisplacementMap'
    | 'feDistantLight'
    | 'feFlood'
    | 'feFuncA'
    | 'feFuncB'
    | 'feFuncG'
    | 'feFuncR'
    | 'feGaussianBlur'
    | 'feImage'
    | 'feMerge'
    | 'feMergeNode'
    | 'feMorphology'
    | 'feOffset'
    | 'fePointLight'
    | 'feSpecularLighting'
    | 'feSpotLight'
    | 'feTile'
    | 'feTurbulence'
    | 'feDistantLight'
    | 'fePointLight'
    | 'feSpotLight';
  type: 'element';
  value: string;
  attributes: Record<string, string>;
  children: SVGGraphicType[];
};

export type SVGType = {
  type: 'svg';
  graphic: SVGGraphicType;
} & MoveableElement;

export type TextType = {
  type: 'text';
  content: string;
  props: React.CSSProperties;
} & MoveableElement;

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
  border: {
    id: 'none' | 'circle' | 'rectangle';
    stroke: string;
    strokeWidth: number;
  };
} & MoveableElement;

export type CanvasElement = ImageType | TextType | SVGPathType | SVGCurveType | SVGType;
export type CanvasElementWithPointAtoms =
  | Exclude<CanvasElement, SVGCurveType>
  | SVGCurveWithPointAtoms;
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
  height: 400,
  border: {
    id: 'none',
    stroke: 'black',
    strokeWidth: 1
  }
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

export const activeElementAtom = atom(
  (get) => {
    const activeElementAtom = get(activeElementAtomAtom);
    if (activeElementAtom) {
      const el = get(activeElementAtom);
      return el;
    }
    return null;
  },
  (
    get,
    set,
    element: CanvasElementWithPointAtoms | SetStateAction<CanvasElementWithPointAtoms>
  ) => {
    const activeElementAtom = get(activeElementAtomAtom);
    if (activeElementAtom) {
      set(activeElementAtom, element);
    }
  }
);

export const canvasAtom = atom({
  width: 800,
  height: 650,
  scale: 1,
  backgroundColor: 'white',
  isSelected: false
});

export const positionAtom = atom(
  (get) => {
    const selected = get(selectedItemsAtom);
    const x = selected.elements.reduce((prev, el) => {
      let x = el.x;
      if (el.type === 'svg-curve') {
        x = el.points.reduce((prev, point) => Math.min(prev, get(point).x), Infinity);
      }
      return Math.min(prev, x);
    }, Infinity);
    const y = selected.elements.reduce((prev, el) => {
      let y = el.y;
      if (el.type === 'svg-curve') {
        y = el.points.reduce((prev, point) => Math.min(prev, get(point).y), Infinity);
      }
      return Math.min(prev, y);
    }, Infinity);

    return { x, y };
  },
  (get, set, update: { x: number; y: number }) => {
    const selected = get(selectedItemsAtom);
    selected.atoms.forEach((elementAtom) => {
      set(elementAtom, (el) => {
        if (el.type === 'svg-curve') {
          el.points.forEach((pointAtom) => {
            set(pointAtom, (point) => {
              return {
                ...point,
                x: update.x + point.x,
                y: update.y + point.y
              };
            });
          });

          return el;
        }
        return {
          ...el,
          x: update.x + el.x,
          y: update.y + el.y
        };
      });
    });
  }
);

export const dimensionAtom = atom(
  (get) => {
    const selected = get(selectedItemsAtom);
    const { x, y } = get(positionAtom);
    const width = selected.elements.reduce((prev, el) => {
      let pX = el.x + el.width - x;
      if (el.type === 'svg-curve') {
        pX = el.points.reduce((prev, point) => Math.max(prev, get(point).x - x), 0);
      }
      return Math.max(prev, pX);
    }, 0);
    const height = selected.elements.reduce((prev, el) => {
      let pY = el.y + el.height - y;
      if (el.type === 'svg-curve') {
        pY = el.points.reduce((prev, point) => Math.max(prev, get(point).y - y), 0);
      }
      return Math.max(prev, pY);
    }, 0);

    return { width, height };
  },
  (get, set, { width, height }: { width: number; height: number }) => {
    const selected = get(selectedItemsAtom);
    selected.atoms.forEach((elementAtom) => {
      set(elementAtom, (el) => {
        return {
          ...el,
          height: el.height + height,
          width: el.width + width
        };
      });
    });
  }
);

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

export const isMovingAtom = atom(false);

export const unSelectAllAtom = atom(null, (_get, set) => {
  set(selectedElementAtomsAtom, []);
  set(activeElementAtomAtom, null);
});

export type NavState =
  | 'templates'
  | 'upload'
  | 'photos'
  | 'text'
  | 'curves'
  | 'shapes'
  | 'graphics'
  | 'position'
  | 'image-editing';

export const sidepanelAtom = atom<NavState>('shapes');
export const circleCropAtom = atom(false);
export const imageUrlAtom = atom((get) => {
  return get(selectedImageAtom)?.url ?? '';
});

export const imageStateAtom = atom((get) => {
  return get(selectedImageAtom)?.state ?? ImageState.Normal;
});

export const imageDimensionsAtom = atom((get) => {
  const image = get(selectedImageAtom);
  if (image) {
    return {
      width: image.width,
      height: image.height
    };
  }

  return { width: 0, height: 0 };
});

export const isCroppingAtom = atom(false);

export const selectedImageAtom = atom(
  (get) => {
    const activeElementAtom = get(activeElementAtomAtom);
    if (activeElementAtom) {
      const selectedElement = get(activeElementAtom);
      return selectedElement.type === 'image' ? selectedElement : null;
    }
    return null;
  },
  (get, set, update: Partial<ImageType>) => {
    const activeElementAtom = get(activeElementAtomAtom);
    if (activeElementAtom) {
      console.log('activeElementAtom', activeElementAtom, update);
      set(activeElementAtom, (el) =>
        el.type === 'image'
          ? ({
              ...el,
              ...update
            } as CanvasElementWithPointAtoms)
          : el
      );
    }
  }
);

export const imageBorderAtom = atom(
  (get) => {
    const image = get(selectedImageAtom);
    if (!image) return null;
    return image.border;
  },
  (get, set, border: Partial<ImageType['border']>) => {
    const image = get(selectedImageAtom);
    if (!image) return;
    console.log('border: ', border);
    set(selectedImageAtom, { ...image, border: { ...image.border, ...border } });
  }
);
