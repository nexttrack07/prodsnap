import React, { SetStateAction, useCallback } from 'react';
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
import { elementsAtom, selectedElementsAtom } from '@/components/canvas/element.store';
import { Atom, CanvasElementType, CanvasItemType } from '@/components/canvas/types';

const unSelectAllAtom = atom(null, (_get, set) => {
  set(selectedElementAtomsAtom, []);
});

export function Canvas() {
  // const elementAtoms = useAtomValue(elementAtomsAtom);
  const elements = useAtomValue(elementsAtom);
  // const unSelectAllElements = useSetAtom(unSelectAllAtom);
  const { width, height, backgroundColor } = useAtomValue(canvasAtom);
  const selected = useAtomValue(selectedElementAtomsAtom);

  // const handleCanvasMouseDown = () => {
  //   unSelectAllElements();
  // };

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
      // onMouseDown={handleCanvasMouseDown}
    >
      <MultipleSelect />
      {elements.map((el) => (
        <Element key={el.atom.toString()} item={el} />
      ))}
    </Box>
  );
}

export const elementCompMap: Record<CanvasElementType['type'], React.FC<any>> = {
  path: RenderPath,
  curve: RenderCurve,
  text: RenderText,
  image: RenderImage
};

export function Element({ item }: { item: CanvasElementType }) {
  const element = useAtomValue<CanvasItemType>(item.atom);
  const setElement = useSetAtom<CanvasItemType, SetStateAction<CanvasItemType>, void>(item.atom);
  const [selectedElementAtoms, setSelectedElementAtoms] = useAtom(selectedElementsAtom);
  // const atomGroup = useAtomValue(groupFromElementAtom(element));
  const isShiftPressed = useShiftKeyPressed();
  // const setActiveElementAtom = useSetAtom(activeElementAtomAtom);

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementAtoms((selectedItems) => {
      // setActiveElementAtom(elementAtom);
      if (selectedItems.includes(item)) return selectedItems;
      // if (atomGroup) {
      //   return isShiftPressed ? selectedItems.concat(atomGroup) : atomGroup;
      // }
      return isShiftPressed ? selectedItems.concat(item) : [item];
    });
  };

  const handleSetElement = useCallback((element: CanvasItemType) => {
    setElement(element);
  }, []);

  const Comp = elementCompMap[element.type];

  return (
    <Comp
      onSelect={handleSelectElement}
      element={element}
      setElement={handleSetElement}
      isSelected={selectedElementAtoms.includes(item)}
    />
  );
}
