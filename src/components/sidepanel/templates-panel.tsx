import React, { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import {
  CanvasElement,
  createAtom,
  elementAtomsAtom,
  selectedElementAtomsAtom
} from '../canvas/store';
import { addGroupAtom } from '../toolbar';
import { deserialize } from '@/utils';
import { Box, Image, LoadingOverlay, SimpleGrid } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

export function TemplatesPanel() {
  const setElementAtoms = useSetAtom(elementAtomsAtom);
  const setSelectedAtoms = useSetAtom(selectedElementAtomsAtom);
  const addGroup = useSetAtom(addGroupAtom);

  const handleAddTemplate = (newEls: CanvasElement[]) => {
    const newElAtoms = newEls.map((el) => createAtom(el));
    setElementAtoms((elAtoms) => [...elAtoms, ...newElAtoms]);
    setSelectedAtoms(newElAtoms);
    addGroup();
  };

  return (
    <SimpleGrid cols={2}>
      <LoadingOverlay loaderProps={{ size: 'sm', color: 'pink', variant: 'bars' }} visible={true} />
    </SimpleGrid>
  );
}
