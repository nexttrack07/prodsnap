import React from 'react';
import { Box } from "@mantine/core";
import { atom, useAtomValue } from 'jotai';
import { elementsAtom, selectedElementsAtom } from '../canvas/store';

const isTextSelectedAtom = atom(
  get => {
    const selectedElementIds = get(selectedElementsAtom);
    if (selectedElementIds.length === 0) return false;
    const selectedElements = selectedElementIds.map(i => get(elementsAtom)[i]);

    return selectedElements.every(el => get(el).type === "text")
  }
)

export function Toolbar() {
  const isTextSelected = useAtomValue(isTextSelectedAtom);
  return (
    <Box>
      Hello
      {isTextSelected && 'Text is selected!!!'}
    </Box>
  )
}