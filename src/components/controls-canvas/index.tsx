import { Box, useMantineTheme } from '@mantine/core';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
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
  unSelectAllAtom,
  GroupedElementType,
  Action,
  CanvasElementWithPointAtoms,
  SVGPointAtom,
  SVGCurveWithPointAtoms,
  ImageState
} from '@/components/canvas/store';
import { DragHandler } from '@/components/canvas/drag-handler';
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { SNAP_TOLERANCE, calculatePosition, useShiftKeyPressed, uuid } from '@/utils';
import { dimensionAtom, positionAtom } from '@/components/canvas/render-group';
import { atomFamily } from 'jotai/utils';
import { RenderPoint } from '@/components/canvas/render-point';
import { RenderBorder } from '@/components/canvas/render-image/render-border';
import { MaskedImageControls, MaskedImageType } from './cropping-image-controls';
import { NormalImageControls, NormalImageType } from './normal-image-controls';

export function ControlsCanvas() {
  const elementAtoms = useAtomValue(elementAtomsAtom);
  const [{ width, height }, setCanvas] = useAtom(canvasAtom);
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

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type !== 'group') setActiveElementAtom(elementAtom);
    setSelectedElementAtoms((selectedItems) => {
      if (selectedItems.includes(elementAtom)) return selectedItems;
      // if (element.type === 'group') {
      //   return isShiftPressed ? selectedItems.concat(atomGroup) : atomGroup;
      // }
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

  if (element.type === 'group') {
    return (
      <GroupRenderer
        onSelect={handleSelectElement}
        isSelected={isSelected}
        group={element}
        setGroupElement={setElement}
      />
    );
  }

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

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
      setElement((prev) => {
        return {
          ...prev,
          mode: 'normal',
          content: event.target.innerText || '',
          width: event.target.offsetWidth ?? 0,
          height: event.target.offsetHeight ?? 0
        };
      });
    };

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
            userSelect: 'none',
            whiteSpace: 'pre-wrap',
            outline: 'none',
            border: `1px solid ${theme.colors.blue[5]}`,
            // width: element.width,
            // height: element.height,
            ...element.props
          }}
          ref={textRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={handleBlur}
        >
          {element.content}
        </div>
      </DragHandler>
    );
  }

  if (element.type === 'svg-curve') {
    return (
      <CurvePointsRenderer
        curve={element}
        isSelected={isSelected}
        onSelect={handleSelectElement}
        setElement={setElement}
      />
    );
  }

  if (element.type === 'image' && element.state === ImageState.Cropping && element.mask) {
    return (
      <MaskedImageControls
        element={element as MaskedImageType}
        setElement={setElement as (update: SetStateAction<MaskedImageType>) => void}
      />
    );
  } else if (element.type === 'image' && element.state === ImageState.Normal && element.mask) {
    return (
      <NormalImageControls
        element={element as NormalImageType}
        setElement={setElement as (update: SetStateAction<NormalImageType>) => void}
        onSelect={handleSelectElement}
        isSelected={isSelected}
      />
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

type Point = { x: number; y: number };

type Result = { x: number; y: number; width: number; height: number };

function getBoundingBox(points: Point[]): Result {
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

const getPointsAtom = atomFamily((atoms: SVGPointAtom[]) =>
  atom((get) => {
    return atoms.map((atom) => get(atom));
  })
);

export function CurvePointsRenderer({
  curve,
  isSelected,
  onSelect,
  setElement
}: {
  curve: SVGCurveWithPointAtoms;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  setElement: (update: SetStateAction<CanvasElementWithPointAtoms>) => void;
}) {
  const points = useAtomValue(getPointsAtom(curve.points));
  const theme = useMantineTheme();
  const { x, y, width, height } = getBoundingBox(points);
  const [moving, setMoving] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(e);
      if (isSelected) {
        setMoving(true);
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [isSelected, onSelect]
  );

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setMoving(false);
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      e.stopPropagation();
      if (moving) {
        const deltaX = e.clientX - lastPos.current.x;
        const deltaY = e.clientY - lastPos.current.y;
        setElement((prev) => {
          return {
            ...prev,
            points: points.map((point) =>
              atom({ ...point, x: point.x + deltaX, y: point.y + deltaY })
            )
          };
        });
      }
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [moving]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        border: isSelected ? `1px solid ${theme.colors.gray[5]}` : 'none',
        left: x,
        top: y,
        cursor: 'pointer',
        width: Math.max(width, 10),
        height: Math.max(height, 10)
      }}
    >
      {isSelected &&
        curve.points.map((pointAtom) => (
          <RenderPoint
            pointAtom={pointAtom}
            position={{ x, y }}
            key={`${pointAtom}`}
            width={curve.strokeWidth ?? 0}
          />
        ))}
    </div>
  );
}

type GroupRendererProps = {
  group: GroupedElementType;
  setGroupElement: (element: Action<CanvasElementWithPointAtoms>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

export function GroupRenderer({
  group,
  setGroupElement,
  isSelected,
  onSelect
}: GroupRendererProps) {
  const [position, setPosition] = useAtom(positionAtom(group.elements));
  const [dimension, setDimension] = useAtom(dimensionAtom(group.elements));
  // const [selecctedElementAtoms, setSelectedElementAtoms] = useAtom(selectedElementAtomsAtom);
  // const isShiftPressed = useShiftKeyPressed();

  const handleMove = (p: Draggable) => {
    setPosition({
      x: p.x,
      y: p.y
    });
  };

  const handleRotate = (angle: number) => {
    setGroupElement((prev) => {
      return {
        ...prev,
        rotation: angle
      };
    });
  };

  // const handleSelectElement = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setSelectedElementAtoms((selectedItems) => {
  //     setActiveElementAtom(elementAtom);
  //     if (selectedItems.includes(elementAtom)) return selectedItems;

  //     return isShiftPressed ? selectedItems.concat(elementAtom) : [elementAtom];
  //   });

  //   if (element.type === 'text' && isSelected) {
  //     setElement((prev) => {
  //       return {
  //         ...prev,
  //         mode: 'editing'
  //       };
  //     });
  //   }
  // };

  return (
    <DragHandler
      position={position}
      dimension={dimension}
      rotation={group.rotation}
      onMove={handleMove}
      onClick={onSelect}
      onRotate={handleRotate}
      hide={!isSelected}
    >
      {group.elements.map((elementAtom) => {
        return (
          <GroupedElementRenderer
            onGroupSelect={onSelect}
            key={`${elementAtom}`}
            elementAtom={elementAtom}
            position={position}
          />
        );
      })}
    </DragHandler>
  );
}

type GroupedElementRendererProps = {
  elementAtom: ElementType;
  position: Draggable;
  onGroupSelect: (e: React.MouseEvent) => void;
};

export function GroupedElementRenderer({
  elementAtom,
  position,
  onGroupSelect
}: GroupedElementRendererProps) {
  const [element, setElement] = useAtom(elementAtom);
  const [activeElementAtom, setActiveElementAtom] = useAtom(activeElementAtomAtom);
  const theme = useMantineTheme();
  const textRef = useRef<HTMLDivElement>(null);
  const isSelected = activeElementAtom === elementAtom;

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveElementAtom(elementAtom);
    onGroupSelect(e);

    if (element.type === 'text' && isSelected) {
      setElement((prev) => {
        return {
          ...prev,
          mode: 'editing'
        };
      });
    }
  };

  if (element.type === 'text' && element.mode === 'editing') {
    return (
      <div
        style={{
          position: 'absolute',
          top: element.y - position.y,
          left: element.x - position.x,
          width: element.width,
          height: element.height,
          border: isSelected ? `2px solid ${theme.colors.blue[9]}` : 'none'
        }}
      >
        <div
          style={{
            position: 'absolute',
            userSelect: 'none',
            whiteSpace: 'pre-wrap',
            outline: 'none',
            border: `1px solid ${theme.colors.blue[5]}`,
            // width: element.width,
            // height: element.height,
            ...element.props
          }}
          ref={textRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={() => {
            setElement((prev) => {
              return {
                ...prev,
                mode: 'normal',
                content: textRef.current?.innerText || ''
              };
            });
          }}
        >
          {element.content}
        </div>
      </div>
    );
  }

  if (element.type === 'svg-curve') {
    return (
      <CurvePointsRenderer
        curve={element}
        isSelected={isSelected}
        onSelect={handleSelectElement}
        setElement={setElement}
      />
    );
  }

  return (
    <div
      onClick={handleSelectElement}
      style={{
        position: 'absolute',
        top: element.y - position.y,
        left: element.x - position.x,
        width: element.width,
        height: element.height,
        border: isSelected ? `2px solid ${theme.colors.blue[9]}` : 'none'
      }}
    />
  );
}
