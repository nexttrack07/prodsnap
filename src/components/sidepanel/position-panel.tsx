import React, { useState } from 'react';
import { Reorder, useMotionValue } from 'framer-motion';
import { useAtom } from 'jotai';
import { elementAtomsAtom } from '../canvas/store';
import { useRaisedShadow } from '@/utils/use-raised-shadow';
import { DragDropContext, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/utils/strict-mode-droppable';

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

type IndexType = { index: number };

const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

export function PositionPanel() {
  // const [atoms, setAtoms] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [atoms, setAtoms] = useAtom(elementAtomsAtom);

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
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {atoms.map((item, index) => (
              <Draggable key={item.toString()} draggableId={item.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    {item.toString()}
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
