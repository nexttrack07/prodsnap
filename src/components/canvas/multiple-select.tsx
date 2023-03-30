import { useAtom, useAtomValue } from 'jotai';
import React from 'react';
import { positionAtom, dimensionAtom } from '@/components/canvas/store';
import { DragHandler } from './drag-handler';

type Props = {
  show: boolean;
};

export function MultipleSelect({ show }: Props) {
  const [position, setPosition] = useAtom(positionAtom);
  const dimension = useAtomValue(dimensionAtom);

  if (!show) {
    return null;
  }

  return (
    <DragHandler
      withMoveHandle
      withBorders
      dimension={dimension}
      position={position}
      onMove={setPosition}
    />
  );
}
