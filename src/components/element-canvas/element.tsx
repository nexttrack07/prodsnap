import {
  Dimension,
  Element,
  ElementAtom,
  ElementGroupAtom,
  Position,
  activeElementAtomAtom,
  attrsAtom,
  selectedElementGroupAtomsAtom
} from '@/stores/elements';
import { atom, useAtom, useAtomValue } from 'jotai';
import { TextRenderer } from './text-renderer';
import { PathRenderer } from './path-renderer';
import { DragHandler } from './drag-handler';
import { useShiftKeyPressed } from '@/utils';
import { useMantineTheme } from '@mantine/core';
import { MouseEvent } from 'react';
import { CurveRenderer } from './curve-renderer';
import { atomFamily } from 'jotai/utils';
import { ImageRenderer } from './image-renderer';

type ElementGroupProps = {
  group: ElementGroupAtom;
};

export function ElementGroup({ group }: ElementGroupProps) {
  const [elementGroup, setElementGroup] = useAtom(group);
  const [{ x, y, width, height }, setAttrs] = useAtom(attrsAtom(elementGroup.elements));
  const [selectedGroupAtoms, setSelectedGroupAtoms] = useAtom(selectedElementGroupAtomsAtom);
  const isShiftPressed = useShiftKeyPressed();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    // if the group is already selected, do nothing
    if (selectedGroupAtoms.includes(group)) {
      return;
    }

    // if shift key is pressed, concat the group to the selected groups
    // else set the selected groups to the group
    if (isShiftPressed) {
      setSelectedGroupAtoms((prev) => [...prev, group]);
    } else {
      setSelectedGroupAtoms([group]);
    }
  };

  const handlePositionChange = (position: Position) => {
    setAttrs({ x: position.x, y: position.y, width: 0, height: 0 });
  };

  const handleRotate = (angle: number) => {
    setElementGroup((prev) => ({
      ...prev,
      angle
    }));
  };

  const handleResize = (attrs: Position & Dimension) => {
    setAttrs(attrs);
  };

  return (
    <DragHandler
      show={selectedGroupAtoms.includes(group)}
      onResize={handleResize}
      onRotate={handleRotate}
      onPositionChange={handlePositionChange}
      attrs={{
        x,
        y,
        width,
        height,
        angle: elementGroup.angle
      }}
    >
      {elementGroup.elements.map((element) => (
        <ElementComponent
          onClick={handleClick}
          position={{ x, y }}
          key={element.toString()}
          elementAtom={element}
        />
      ))}
    </DragHandler>
  );
}

export const elementCompMap: Record<Element['type'], React.FC<any>> = {
  text: TextRenderer,
  path: PathRenderer,
  curve: CurveRenderer,
  image: ImageRenderer
};

type ElementComponentProps = {
  elementAtom: ElementAtom;
  position: Position;
  onClick: (e: React.MouseEvent) => void;
};

const elementAttrsAtom = atomFamily((elementAtom: ElementAtom) =>
  atom((get) => {
    const element = get(elementAtom);

    // if element is a curve, get minx, miny, maxx, maxy and return x, y, width, height
    if (element.type === 'curve') {
      // get points from curve
      const points = element.points.map((pointAtom) => get(pointAtom));
      // get minx, miny, maxx, maxy
      const minX = Math.min(...points.map((point) => point.x));
      const minY = Math.min(...points.map((point) => point.y));
      const maxX = Math.max(...points.map((point) => point.x));
      const maxY = Math.max(...points.map((point) => point.y));

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        angle: element.angle
      };
    }

    return element;
  })
);

function ElementComponent({ elementAtom, position, onClick }: ElementComponentProps) {
  // const element = useAtomValue(elementAtom);
  const [element, setElement] = useAtom(elementAtom);
  const attrs = useAtomValue(elementAttrsAtom(elementAtom));
  const [activeElementAtom, setActiveElementAtom] = useAtom(activeElementAtomAtom);
  const ElementComp = elementCompMap[element.type];
  const theme = useMantineTheme();

  const handleClick = (e: React.MouseEvent) => {
    setActiveElementAtom(elementAtom);
    onClick(e);
  };

  return (
    <div
      id={elementAtom.toString()}
      style={{
        position: 'absolute',
        top: attrs.y - position.y,
        left: attrs.x - position.x,
        width: attrs.width,
        height: attrs.height,
        transform: `rotate(${attrs.angle ?? 0}deg)`,
        transformOrigin: 'center center',
        border: activeElementAtom === elementAtom ? `1px solid ${theme.colors.gray[7]}` : 'none'
      }}
    >
      <ElementComp
        element={element}
        setElement={setElement}
        isSelected={activeElementAtom === elementAtom}
        onSelect={handleClick}
        position={position}
      />
    </div>
  );
}
