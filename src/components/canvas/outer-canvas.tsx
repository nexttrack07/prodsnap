import { Box } from '@mantine/core';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  activeElementAtomAtom,
  canvasAtom,
  Draggable,
  elementAtomsAtom,
  ElementType,
  groupFromElementAtom,
  isGroupedAtom,
  Resizable,
  selectedElementAtomsAtom,
  unSelectAllAtom
} from './store';
import { DragHandler } from './drag-handler';
import { useCallback } from 'react';
import { SNAP_TOLERANCE, calculatePosition, useShiftKeyPressed } from '@/utils';

export function OuterCanvas() {
  const elementAtoms = useAtomValue(elementAtomsAtom);
  const [{ width, height }, setCanvas] = useAtom(canvasAtom);
  // const selected = useAtomValue(selectedElementAtomsAtom);
  const unSelectAllElements = useSetAtom(unSelectAllAtom);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    unSelectAllElements();
    setCanvas((c) => ({ ...c, isSelected: true }));
  };

  return (
    <Box
      onMouseDown={handleCanvasMouseDown}
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          height: height,
          width: width,
          // backgroundColor: 'red',
          position: 'relative'
        }}
      >
        {elementAtoms.map((elementAtom) => (
          <ElementBox key={elementAtom.toString()} elementAtom={elementAtom} />
        ))}
      </Box>
    </Box>
  );
}

export function ElementBox({ elementAtom }: { elementAtom: ElementType }) {
  const [element, setElement] = useAtom(elementAtom);
  const canvasProps = useAtomValue(canvasAtom);
  const [selectedElementAtoms, setSelectedElementAtoms] = useAtom(selectedElementAtomsAtom);
  const atomGroup = useAtomValue(groupFromElementAtom(element));
  const isGrouped = useAtomValue(isGroupedAtom(element));
  const isShiftPressed = useShiftKeyPressed();
  const setActiveElementAtom = useSetAtom(activeElementAtomAtom);

  const handleMouseMove = useCallback(
    (p: Draggable) => {
      setElement((el) => {
        return {
          ...el,
          x: calculatePosition(el.x, p.x, el.width, canvasProps.width, SNAP_TOLERANCE),
          y: calculatePosition(el.y, p.y, el.height, canvasProps.height, SNAP_TOLERANCE)
        };
      });
    },
    [setElement]
  );

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

  const handleRotate = (angle: number) => {
    setElement((prev) => {
      return {
        ...prev,
        rotation: angle // + (prev.rotation ?? 0)
      };
    });
  };

  const handleResize = ({ x, y, width, height }: Draggable & Resizable) => {
    setElement((prev) => {
      let newX = prev.x + x;
      let newY = prev.y + y;
      let newWidth = prev.width + width;
      let newHeight = prev.height + height;

      if (newX > -SNAP_TOLERANCE && newX < SNAP_TOLERANCE) {
        newX = 0;
      }

      if (newY > -SNAP_TOLERANCE && newY < SNAP_TOLERANCE) {
        newY = 0;
      }

      if (
        newX + newWidth > canvasProps.width - SNAP_TOLERANCE &&
        newX + newWidth < canvasProps.width + SNAP_TOLERANCE
      ) {
        newWidth = canvasProps.width - newX;
      }

      if (
        newY + newHeight > canvasProps.height - SNAP_TOLERANCE &&
        newY + newHeight < canvasProps.height + SNAP_TOLERANCE
      ) {
        newHeight = canvasProps.height - newY;
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
    });
  };

  const { x, y, width, height, rotation = 0 } = element;
  return (
    <DragHandler
      position={{ x, y }}
      rotation={rotation}
      dimension={{ width, height }}
      onClick={handleSelectElement}
      onMove={handleMouseMove}
      hide={!(selectedElementAtoms.includes(elementAtom) && !isGrouped)}
      onRotate={handleRotate}
      onResize={handleResize}
    ></DragHandler>
  );
}
