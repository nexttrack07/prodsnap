import React from 'react';
import { Box } from '@mantine/core';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { createElement, ReactNode } from 'react';
import {
  activeElementAtomAtom,
  canvasAtom,
  CanvasElement,
  elementAtomsAtom,
  ElementType,
  groupsByIdAtom,
  selectedElementAtomsAtom,
  selectedItemsAtom,
  SVGType
} from './store';
import { RenderImage } from './render-image';
import { RenderSvg } from './render-svg';
import { RenderText } from './render-text';
import { RenderPath } from './render-path';
import { RenderLine } from './render-line';
import { RenderCurve } from './render-curve';
import { useShiftKeyPressed } from '../../utils';
import { atomFamily } from 'jotai/utils';
import { DragHandler } from './drag-handler';

const unSelectAllAtom = atom(null, (_get, set) => {
  set(selectedElementAtomsAtom, []);
});

export const positionAtom = atom(
  (get) => {
    const selected = get(selectedItemsAtom);
    const x = selected.elements.reduce((prev, el) => Math.min(prev, el.x), Infinity);
    const y = selected.elements.reduce((prev, el) => Math.min(prev, el.y), Infinity);

    return { x, y };
  },
  (get, set, update: { x: number; y: number }) => {
    const selected = get(selectedItemsAtom);
    selected.atoms.forEach((elementAtom) => {
      set(elementAtom, (el) => ({
        ...el,
        x: update.x + el.x,
        y: update.y + el.y
      }));
    });
  }
);

export const dimensionAtom = atom(
  (get) => {
    const selected = get(selectedItemsAtom);
    const { x, y } = get(positionAtom);
    const width = selected.elements.reduce((prev, el) => Math.max(prev, el.x + el.width - x), 0);
    const height = selected.elements.reduce((prev, el) => Math.max(prev, el.y + el.height - y), 0);

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

export function Canvas() {
  const dimension = useAtomValue(dimensionAtom);
  const [position, setPosition] = useAtom(positionAtom);
  const elementAtoms = useAtomValue(elementAtomsAtom);
  const unSelectAllElements = useSetAtom(unSelectAllAtom);
  const { width, height, backgroundColor } = useAtomValue(canvasAtom);
  const selected = useAtomValue(selectedElementAtomsAtom);

  const handleCanvasMouseDown = () => {
    unSelectAllElements();
  };

  return (
    <Box
      id="canvas"
      sx={(theme) => ({
        width,
        height,
        border:
          selected.length === 0
            ? `1px solid ${theme.colors.blue[7]}`
            : `1px solid ${theme.colors.gray[4]}`,
        boxShadow: '0px 0px 0.8px rgba(0,0,0,0.3)',
        position: 'relative',
        backgroundColor,
        overflow: 'hidden'
      })}
      onMouseDown={handleCanvasMouseDown}>
      <DragHandler
        withBorders
        withMoveHandle
        hide={selected.length < 2}
        dimension={dimension}
        position={position}
        onMove={setPosition}
      />
      {elementAtoms.map((elementAtom) => (
        <Element key={elementAtom.toString()} elementAtom={elementAtom} />
      ))}
    </Box>
  );
}

export function renderElement(item: SVGType['elements'][number], i: number): ReactNode {
  const { tag, props } = item;

  return createElement(tag, { ...props, key: i }, null);
}

export const elementCompMap: Record<CanvasElement['type'], React.FC<any>> = {
  svg: RenderSvg,
  image: RenderImage,
  text: RenderText,
  'svg-path': RenderPath,
  'svg-line': RenderLine,
  'svg-curve': RenderCurve
};

const groupFromElementAtom = atomFamily((element: CanvasElement) =>
  atom((get) => {
    if (!element.group) return null;

    const groupsById = get(groupsByIdAtom);
    return groupsById[element.group];
  })
);

export function Element({ elementAtom }: { elementAtom: ElementType }) {
  const [element, setElement] = useAtom(elementAtom);
  const [selectedElementAtoms, setSelectedElementAtoms] = useAtom(selectedElementAtomsAtom);
  const atomGroup = useAtomValue(groupFromElementAtom(element));
  const isShiftPressed = useShiftKeyPressed();
  const setActiveElementAtom = useSetAtom(activeElementAtomAtom);

  const handleSelectElement = (e: React.MouseEvent) => {
    console.log('Hello from onSelect');
    e.stopPropagation();
    setSelectedElementAtoms((selectedItems) => {
      setActiveElementAtom(elementAtom);
      if (selectedItems.includes(elementAtom)) return selectedItems;
      if (atomGroup) {
        return isShiftPressed ? selectedItems.concat(atomGroup) : atomGroup;
      }
      return isShiftPressed ? selectedItems.concat(elementAtom) : [elementAtom];
    });
  };

  const Comp = elementCompMap[element.type];

  return (
    <Comp
      onSelect={handleSelectElement}
      element={element}
      setElement={setElement}
      isSelected={selectedElementAtoms.includes(elementAtom)}
    />
  );
}
