import { Text, Space, createStyles, SimpleGrid } from '@mantine/core';
import React from 'react';
import { atom, useSetAtom } from 'jotai';
import {
  addElementAtom,
  CanvasElement,
  MoveableElement,
  SVGCurveType,
  SVGLineType
} from '../../components/canvas/store';

const useStyles = createStyles(() => ({
  shape: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
      transform: 'scale(1.1)',
      transition: 'transform 0.3s'
    }
  }
}));

const data: { id: number; prev: string; data: MoveableElement & SVGCurveType }[] = [
  {
    id: 0,
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve',
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'none',
      endMarker: 'none',
      // TODO: DONT USE THIS - create atoms inside the component
      points: [
        {
          type: 'svg-point',
          x: 100,
          y: 100
        },
        {
          type: 'svg-point',
          x: 200,
          y: 200
        },
        {
          type: 'svg-point',
          x: 500,
          y: 100
        }
      ]
    }
  },
  {
    id: 1,
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'svg-curve',
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeWidth: 2,
      stroke: 'black',
      startMarker: 'none',
      endMarker: 'none',
      // TODO: DONT USE THIS - create atoms inside the component
      points: [
        {
          type: 'svg-point',
          x: 100,
          y: 100
        },
        {
          type: 'svg-point',
          x: 400,
          y: 400
        },
        {
          type: 'svg-point',
          x: 200,
          y: 200
        },
        {
          type: 'svg-point',
          x: 500,
          y: 100
        }
      ]
    }
  }
];

const templateData = [
  {
    id: 0,
    data: [{}]
  }
];

export function CurvesPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    addElement({ ...newEl, points: newEl.points.map((p) => atom(p)) });
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Lines
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        {data.map((item) => (
          <div key={item.id}>
            <svg
              key={item.id}
              className={classes.shape}
              fill="#000"
              stroke="#000"
              style={{
                height: '100%',
                width: '100%',
                minHeight: 1,
                minWidth: 1,
                overflow: 'visible'
              }}
              onClick={() => handleAddElement(item.data)}
            >
              <g transform="scale(1) translate(0, 0.5)">
                <path d={item.prev} />
              </g>
            </svg>
          </div>
        ))}
      </SimpleGrid>
    </>
  );
}
