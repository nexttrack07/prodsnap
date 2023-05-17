import { useAtom, useSetAtom } from 'jotai';
import { positionAtom, dimensionAtom, rotateAtom } from '@/components/canvas/store';
import { DragHandler } from './drag-handler';
import { ResizeHandler } from './resize-handler';
import { RotateHandler } from './rotate-handler';
import { useState } from 'react';

type Props = {
  show: boolean;
};

export function MultipleSelect({ show }: Props) {
  const [position, setPosition] = useAtom(positionAtom);
  const [dimension, setDimension] = useAtom(dimensionAtom);
  const [rotation, setRotation] = useState(0);
  const setElementsRotation = useSetAtom(rotateAtom);

  if (!show) {
    return null;
  }

  const handleRotate = (angle: number) => {
    setElementsRotation(angle);
    setRotation(angle);
  };

  return (
    <>
      <DragHandler
        withMoveHandle
        withBorders={false}
        dimension={dimension}
        position={position}
        onMove={setPosition}
        rotation={rotation}
      >
        <ResizeHandler dimension={dimension} onResize={setDimension} />
        <RotateHandler dimension={dimension} position={position} onRotate={handleRotate} />
      </DragHandler>
    </>
  );
}
