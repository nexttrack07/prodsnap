import React from 'react';
import { Box } from "@mantine/core";
import { atom, useAtomValue } from 'jotai';
import { CanvasElement, elementsAtom, selectedElementsAtom } from '../canvas/store';
import { ImageToolbar } from './image-toolbar';

const getTypeAtom = atom(
  get => {
    const selectedElementIds = get(selectedElementsAtom);
    if (selectedElementIds.length === 0) return (_: CanvasElement["type"]) => false
    const selectedElements = selectedElementIds.map(i => get(elementsAtom)[i]);

    return (type: CanvasElement["type"]) => selectedElements.every(el => get(el).type === type)
  }
)

export function Toolbar() {
  const getType = useAtomValue(getTypeAtom);

  return (
    <Box p="xs">
      {getType("text") && 'Text is selected!!!'}
      {getType("image") && <ImageToolbar />}
      {getType("svg") && 'graphic is selected'}
    </Box>
  )
}
