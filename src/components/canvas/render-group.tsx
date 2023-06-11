import { atom, useAtom } from 'jotai';
import { GroupedElementType, ElementType, CanvasElementWithPointAtoms } from './store';
import { RenderImage } from './render-image/render-image';
import { RenderText } from './render-text';
import { RenderPath } from './render-path';
import { RenderCurve } from './render-curve';
import { RenderGraphic } from './render-graphic';
import { atomFamily } from 'jotai/utils';

type Props = {
  element: GroupedElementType;
};

export function RenderGroup({ element: group }: Props) {
  const [dimension, setDimension] = useAtom(dimensionAtom(group.elements));
  const [position, setPosition] = useAtom(positionAtom(group.elements));

  return (
    <div
      id="grouped-element"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: dimension.width,
        height: dimension.height,
        transform: `rotate(${group.rotation}deg)`,
        transformOrigin: 'center center'
      }}
    >
      {group.elements.map((elementAtom) => (
        <RenderGroupedElement
          key={`${elementAtom}`}
          position={position}
          elementAtom={elementAtom}
        />
      ))}
    </div>
  );
}

const elementCompMap: Record<CanvasElementWithPointAtoms['type'], React.FC<any>> = {
  image: RenderImage,
  text: RenderText,
  group: RenderGroup,
  'svg-path': RenderPath,
  'svg-curve': RenderCurve,
  'svg-graphic': RenderGraphic
};

export function RenderGroupedElement({
  elementAtom,
  position
}: {
  elementAtom: ElementType;
  position: { x: number; y: number };
}) {
  const [element, setElement] = useAtom(elementAtom);
  const Comp = elementCompMap[element.type];

  if (element.type === 'svg-curve') {
    return (
      <RenderCurve
        element={element}
        setElement={setElement}
        onSelect={() => {}}
        position={position}
        isSelected
      />
    );
  }

  return (
    <Comp
      element={{ ...element, x: element.x - position.x, y: element.y - position.y }}
      setElement={setElement}
    />
  );
}

export const positionAtom = atomFamily((atoms: ElementType[]) =>
  atom(
    (get) => {
      const elements = atoms.map((item) => get(item));
      const x = elements.reduce((prev, el) => {
        let x = el.x;
        if (el.type === 'svg-curve') {
          x = el.points.reduce((prev, point) => Math.min(prev, get(point).x), Infinity);
        }
        return Math.min(prev, x);
      }, Infinity);
      const y = elements.reduce((prev, el) => {
        let y = el.y;
        if (el.type === 'svg-curve') {
          y = el.points.reduce((prev, point) => Math.min(prev, get(point).y), Infinity);
        }
        return Math.min(prev, y);
      }, Infinity);

      return { x, y };
    },
    (get, set, update: { x: number; y: number }) => {
      // const selected = get(selectedItemsAtom);
      atoms.forEach((elementAtom) => {
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
  )
);

export const dimensionAtom = atomFamily((atoms: ElementType[]) =>
  atom(
    (get) => {
      const elements = atoms.map((item) => get(item));

      const { x, y } = get(positionAtom(atoms));
      const width = elements.reduce((prev, el) => {
        let pX = el.x + el.width - x;
        if (el.type === 'svg-curve') {
          pX = el.points.reduce((prev, point) => Math.max(prev, get(point).x - x), 0);
        }
        return Math.max(prev, pX);
      }, 0);
      const height = elements.reduce((prev, el) => {
        let pY = el.y + el.height - y;
        if (el.type === 'svg-curve') {
          pY = el.points.reduce((prev, point) => Math.max(prev, get(point).y - y), 0);
        }
        return Math.max(prev, pY);
      }, 0);

      return { width, height };
    },
    (get, set, { width, height }: { width: number; height: number }) => {
      atoms.forEach((elementAtom) => {
        set(elementAtom, (el) => {
          return {
            ...el,
            height: el.height + height,
            width: el.width + width
          };
        });
      });
    }
  )
);
