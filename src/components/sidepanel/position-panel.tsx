import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { elementAtomsAtom, ElementType } from '../canvas/store';
import { DragDropContext, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/utils/strict-mode-droppable';
import { Card, Center, Image, Text, useMantineTheme } from '@mantine/core';
import { DragDrop } from 'tabler-icons-react';
import { scalePathData } from '../canvas/render-path';

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function PositionPanel() {
  const [atoms, setAtoms] = useAtom(elementAtomsAtom);
  const theme = useMantineTheme();

  if (atoms.length === 0) {
    return (
      <Card p="xl" radius="md" withBorder>
        <Center>
          <Text>Add an item</Text>
        </Center>
      </Card>
    );
  }
  const grid = 8;

  const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: theme.radius.sm,
    borderStyle: 'solid',
    borderColor: theme.colors.gray[4],
    borderWidth: 1,
    background: isDragging ? theme.colors.blue[5] : '',
    color: isDragging ? theme.colors.blue[0] : theme.colors.gray[9],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 75,
    overflow: 'hidden',
    // styles we need to apply on draggables
    ...draggableStyle
  });

  const handleDragEnd: OnDragEndResponder = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(atoms, result.source.index, result.destination.index);

    setAtoms(items);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {atoms.map((item, index) => (
              <Draggable key={item.toString()} draggableId={item.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <RenderElement elementAtom={item} />
                    <DragDrop />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}

function RenderElement({ elementAtom }: { elementAtom: ElementType }) {
  const element = useAtomValue(elementAtom);
  const { width, height } = element;

  if (element.type === 'text') {
    return <span style={{ ...element.props }}>{element.content}</span>;
  } else if (element.type === 'svg-path') {
    return (
      <svg
        fill={element.props.fill}
        stroke={element.strokeProps.stroke}
        strokeWidth={element.strokeProps.strokeWidth}
        width={100}
        height="auto"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path
          {...element.path}
          d={scalePathData(element.path.d!, width, height, element.strokeProps.strokeWidth)}
        />
      </svg>
    );
  } else if (element.type === 'image') {
    return (
      <Image
        style={{ userSelect: 'none', pointerEvents: 'none' }}
        height={60}
        width="auto"
        src={element.currentUrl ?? element.url}
      />
    );
  }

  return <>{elementAtom.toString()}</>;
}
