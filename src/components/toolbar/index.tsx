import React from 'react';
import { Box } from "@mantine/core";
import { atom, useAtomValue } from 'jotai';
import { CanvasElement, elementsAtom, selectedElementsAtom } from '../canvas/store';

const isTextSelectedAtom = atom(
  get => {
    const selectedElementIds = get(selectedElementsAtom);
    if (selectedElementIds.length === 0) return (type: CanvasElement["type"]) => false
    const selectedElements = selectedElementIds.map(i => get(elementsAtom)[i]);

    return (type: CanvasElement["type"]) => selectedElements.every(el => get(el).type === type)
  }
)

export function Toolbar() {
  const getType = useAtomValue(isTextSelectedAtom);

  return (
    <Box p="md">
      {getType("text") && 'Text is selected!!!'}
      {getType("image") && 'Image is Selected'}
      {getType("svg") && 'graphic is selected'}
    </Box>
  )
}