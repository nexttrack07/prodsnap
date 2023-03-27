import React, { useCallback } from 'react';
import { Box } from '@mantine/core';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  activeElementAtomAtom,
  canvasAtom,
  CanvasElementWithPointAtoms,
  elementAtomsAtom,
  ElementType,
  groupsByIdAtom,
  selectedElementAtomsAtom
} from './store';
import { RenderImage } from './render-image';
import { RenderText } from './render-text';
import { RenderPath } from './render-path';
import { RenderCurve } from './render-curve';
import { useShiftKeyPressed } from '../../utils';
import { atomFamily } from 'jotai/utils';
import { MultipleSelect } from './multiple-select';

const unSelectAllAtom = atom(null, (_get, set) => {
  set(selectedElementAtomsAtom, []);
});

export function Canvas() {
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
      onMouseDown={handleCanvasMouseDown}
    >
      <MultipleSelect />
      {elementAtoms.map((elementAtom) => (
        <Element key={elementAtom.toString()} elementAtom={elementAtom} />
      ))}
    </Box>
  );
}

export const elementCompMap: Record<CanvasElementWithPointAtoms['type'], React.FC<any>> = {
  image: RenderImage,
  text: RenderText,
  'svg-path': RenderPath,
  'svg-curve': RenderCurve
};

const groupFromElementAtom = atomFamily((element: CanvasElementWithPointAtoms) =>
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

  const handleSetElement = useCallback((element: CanvasElementWithPointAtoms) => {
    setElement(element);
  }, []);

  const Comp = elementCompMap[element.type];

  return (
    <Comp
      onSelect={handleSelectElement}
      element={element}
      setElement={handleSetElement}
      isSelected={selectedElementAtoms.includes(elementAtom)}
    />
  );
}
