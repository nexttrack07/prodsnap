import {
  Dimension,
  Element,
  ElementAtom,
  ElementGroupAtom,
  Position,
  activeElementAtomAtom,
  attrsAtom,
  dimensionAtom,
  positionAndDimensionAtom,
  positionAtom,
  selectedElementGroupAtomsAtom
} from '@/stores/elements';
import { useAtom, useAtomValue } from 'jotai';
import { TextRenderer } from './text-renderer';
import { PathRenderer } from './path-renderer';
import { DragHandler } from './drag-handler';
import { useShiftKeyPressed } from '@/utils';
import { useMantineTheme } from '@mantine/core';
import { MouseEvent, useEffect, useState } from 'react';

type ElementGroupProps = {
  group: ElementGroupAtom;
};

export function ElementGroup({ group }: ElementGroupProps) {
  const [elementGroup, setElementGroup] = useAtom(group);
  // const [{ x, y }, setPosition] = useAtom(positionAtom(elementGroup.elements));
  // const [{ width, height }, setDimension] = useAtom(dimensionAtom(elementGroup.elements));
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
    <div id="element-group" onMouseDown={handleClick}>
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
          <ElementComponent position={{ x, y }} key={element.toString()} elementAtom={element} />
        ))}
      </DragHandler>
    </div>
  );
}

export const elementCompMap: Record<Element['type'], React.FC<any>> = {
  text: TextRenderer,
  path: PathRenderer
};

type ElementComponentProps = {
  elementAtom: ElementAtom;
  position: Position;
};

function ElementComponent({ elementAtom, position }: ElementComponentProps) {
  const element = useAtomValue(elementAtom);
  const [activeElement, setActiveElement] = useAtom(activeElementAtomAtom);
  const ElementComp = elementCompMap[element.type];
  const theme = useMantineTheme();

  const handleClick = () => {
    setActiveElement(elementAtom);
  };

  return (
    <div
      id={elementAtom.toString()}
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: element.y - position.y,
        left: element.x - position.x,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.angle ?? 0}deg)`,
        transformOrigin: 'center center',
        border: activeElement === elementAtom ? `2px solid ${theme.colors.gray[7]}` : 'none'
      }}
    >
      <ElementComp element={element} />
    </div>
  );
}
