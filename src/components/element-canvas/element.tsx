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
  const [{ x, y, width, height }, setAttrs] = useAtom(attrsAtom(elementGroup.elements));
  const [selectedGroupAtoms, setSelectedGroupAtoms] = useAtom(selectedElementGroupAtomsAtom);
  const isShiftPressed = useShiftKeyPressed();

  const handleClick = (e: MouseEvent) => {
    console.log('click in element group');
    e.stopPropagation();
    // if the group is already selected, do nothing
    if (selectedGroupAtoms.includes(group)) {
      return;
    }

    // if shift key is pressed, concat the group to the selected groups
    // else set the selected groups to the group
    if (isShiftPressed) {
      console.log('shift pressed');
      console.log('selectedGroupAtoms', selectedGroupAtoms);
      setSelectedGroupAtoms((prev) => [...prev, group]);
    } else {
      console.log('shift not pressed');
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
  path: PathRenderer
};

type ElementComponentProps = {
  elementAtom: ElementAtom;
  position: Position;
  onClick: (e: React.MouseEvent) => void;
};

function ElementComponent({ elementAtom, position, onClick }: ElementComponentProps) {
  // const element = useAtomValue(elementAtom);
  const [element, setElement] = useAtom(elementAtom);
  const [activeElementAtom, setActiveElementAtom] = useAtom(activeElementAtomAtom);
  const ElementComp = elementCompMap[element.type];
  const theme = useMantineTheme();

  const handleClick = (e: React.MouseEvent) => {
    console.log('click in element component');
    setActiveElementAtom(elementAtom);
    onClick(e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('mouse down in element component');
  };

  return (
    <div
      id={elementAtom.toString()}
      // onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: element.y - position.y,
        left: element.x - position.x,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.angle ?? 0}deg)`,
        transformOrigin: 'center center',
        border: activeElementAtom === elementAtom ? `2px solid ${theme.colors.gray[7]}` : 'none'
      }}
    >
      <ElementComp
        element={element}
        setElement={setElement}
        isSelected={activeElementAtom === elementAtom}
        onSelect={handleClick}
      />
    </div>
  );
}
