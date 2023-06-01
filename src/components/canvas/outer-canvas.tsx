import { Box, useMantineTheme } from '@mantine/core';
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
import { useCallback, useEffect, useRef } from 'react';
import { SNAP_TOLERANCE, calculatePosition, useShiftKeyPressed } from '@/utils';
import AutosizeInput from 'react-input-autosize';

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
      id="outer-canvas-container"
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
        id="outer-canvas"
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
  const isSelected = selectedElementAtoms.includes(elementAtom);
  const theme = useMantineTheme();
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSelected && element.type === 'text') {
      setElement((el) => ({
        ...el,
        mode: 'normal'
      }));
    }
  }, [isSelected, element.type]);

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

    if (element.type === 'text' && isSelected) {
      setElement((prev) => {
        return {
          ...prev,
          mode: 'editing'
        };
      });
    }
  };

  const handleRotate = (angle: number) => {
    setElement((prev) => {
      return {
        ...prev,
        rotation: angle
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

      let newEl = {
        ...prev,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };

      if (element.type === 'text') {
        const newHeight = (newWidth / element.width) * element.height;
        const newFontSize = (newWidth / element.width) * (element.props.fontSize as number);

        newEl = {
          ...newEl,
          height: newHeight,
          props: {
            ...(newEl as any).props,
            fontSize: newFontSize
          }
        } as any;
      }

      return newEl;
    });
  };

  const { x, y, width, height, rotation = 0 } = element;

  let hideHandlers = !isSelected && !isGrouped;

  if (element.type === 'text' && element.mode === 'editing') {
    hideHandlers = true;
    return (
      <DragHandler
        position={{ x, y }}
        rotation={rotation}
        dimension={{ width, height }}
        onClick={handleSelectElement}
        onMove={handleMouseMove}
        hide={hideHandlers}
        onRotate={handleRotate}
        onResize={handleResize}
      >
        <div
          style={{
            position: 'absolute',
            visibility: 'hidden',
            width: element.width,
            height: element.height
          }}
          ref={textRef}
        >
          {element.content}
        </div>
        <AutosizeInput
          inputStyle={{
            // remove all input styles
            border: `1px solid ${theme.colors.gray[9]}`,
            outline: 'none',
            background: 'none',
            padding: 0,
            resize: 'none',
            ...element.props
          }}
          type="text"
          value={element.content}
          onChange={(e) => {
            setElement((prev) => {
              return {
                ...prev,
                content: e.target.value
              };
            });
          }}
        />
      </DragHandler>
    );
  }

  return (
    <DragHandler
      position={{ x, y }}
      rotation={rotation}
      dimension={{ width, height }}
      onClick={handleSelectElement}
      onMove={handleMouseMove}
      hide={hideHandlers}
      onRotate={handleRotate}
      onResize={handleResize}
    ></DragHandler>
  );
}
