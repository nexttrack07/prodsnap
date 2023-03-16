import React from 'react';
import { Box } from '@mantine/core';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { createElement, ReactNode } from 'react';
import {
  canvasAtom,
  CanvasElement,
  elementAtomsAtom,
  ElementType,
  groupsByIdAtom,
  selectedElementAtomsAtom,
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

export function Canvas() {
  const elementAtoms = useAtomValue(elementAtomsAtom);
  const unSelectAllElements = useSetAtom(unSelectAllAtom);
  const { width, height, backgroundColor } = useAtomValue(canvasAtom);
  const selected = useAtomValue(selectedElementAtomsAtom).length === 0;

  const handleCanvasMouseDown = () => {
    unSelectAllElements();
  };

  return (
    <Box
      id="canvas"
      sx={(theme) => ({
        width,
        height,
        border: selected
          ? `1px solid ${theme.colors.blue[7]}`
          : `1px solid ${theme.colors.gray[4]}`,
        boxShadow: '0px 0px 0.8px rgba(0,0,0,0.3)',
        position: 'relative',
        backgroundColor,
        overflow: 'hidden'
      })}
      onMouseDown={handleCanvasMouseDown}>
      <DragHandler />
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

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementAtoms((selectedItems) => {
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
