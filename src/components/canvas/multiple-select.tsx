import { useAtom, useAtomValue } from 'jotai';
import React from 'react';
import { positionAtom, dimensionAtom } from '@/components/canvas/store';
import { DragHandler } from './drag-handler';

export function MultipleSelect() {
  const [position, setPosition] = useAtom(positionAtom);
  const dimension = useAtomValue(dimensionAtom);

  return <DragHandler dimension={dimension} position={position} onMove={setPosition} />;
}
