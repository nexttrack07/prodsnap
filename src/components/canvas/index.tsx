import React, { useCallback } from 'react';
import { Box } from '@mantine/core';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  activeElementAtomAtom,
  canvasAtom,
  CanvasElementWithPointAtoms,
  elementAtomsAtom,
  ElementType,
  groupFromElementAtom,
  groupsByIdAtom,
  isGroupedAtom,
  selectedElementAtomsAtom,
  unSelectAllAtom
} from './store';
import { RenderImage } from './render-image/render-image';
import { RenderText } from './render-text';
import { RenderPath } from './render-path';
import { RenderCurve } from './render-curve';
// import { RenderGuide } from './render-guides';
import { useShiftKeyPressed } from '../../utils';
import { MultipleSelect } from './multiple-select';
import { RenderGraphic } from './render-graphic';
import { RenderGroup } from './render-group';

export function Canvas() {
  const elementAtoms = useAtomValue(elementAtomsAtom);
  const unSelectAllElements = useSetAtom(unSelectAllAtom);
  const [{ width, height, backgroundColor }, setCanvas] = useAtom(canvasAtom);
  const selected = useAtomValue(selectedElementAtomsAtom);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    unSelectAllElements();
    setCanvas((c) => ({ ...c, isSelected: true }));
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
      {elementAtoms.map((elementAtom) => (
        <Element key={elementAtom.toString()} elementAtom={elementAtom} />
      ))}
    </Box>
  );
}

export const elementCompMap: Record<CanvasElementWithPointAtoms['type'], React.FC<any>> = {
  image: RenderImage,
  text: RenderText,
  group: RenderGroup,
  'svg-path': RenderPath,
  'svg-curve': RenderCurve,
  'svg-graphic': RenderGraphic
};

export function Element({ elementAtom }: { elementAtom: ElementType }) {
  const [element, setElement] = useAtom(elementAtom);
  const [selectedElementAtoms, setSelectedElementAtoms] = useAtom(selectedElementAtomsAtom);
  const atomGroup = useAtomValue(groupFromElementAtom(element));
  const isGrouped = useAtomValue(isGroupedAtom(element));
  const isShiftPressed = useShiftKeyPressed();
  const setActiveElementAtom = useSetAtom(activeElementAtomAtom);

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveElementAtom(elementAtom);
    setSelectedElementAtoms((selectedItems) => {
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
      isGrouped={isGrouped}
      setElement={handleSetElement}
      isSelected={selectedElementAtoms.includes(elementAtom) && !isGrouped}
    />
  );
}
