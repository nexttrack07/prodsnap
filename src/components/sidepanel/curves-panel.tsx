import { Text, Space, createStyles, SimpleGrid } from '@mantine/core';
import React from 'react';
import { atom, useSetAtom } from 'jotai';
import { addElementAtom } from '../../components/canvas/element.store';
import { CanvasItemType, ICurve } from '../canvas/types';

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

const data: { id: number; prev: string; data: ICurve }[] = [
  {
    id: 0,
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'curve',
      left: 200,
      top: 200,
      width: 100,
      height: 3,
      attrs: {
        path: {
          strokeWidth: 2,
          stroke: 'black'
        },
        startMarker: 'none',
        endMarker: 'none'
      },
      points: [
        {
          x: 100,
          y: 100
        },
        {
          x: 200,
          y: 200
        },
        {
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
      type: 'curve',
      left: 200,
      top: 200,
      width: 100,
      height: 3,
      attrs: {
        path: {
          strokeWidth: 2,
          stroke: 'black'
        },
        startMarker: 'none',
        endMarker: 'none'
      },
      points: [
        {
          x: 100,
          y: 100
        },
        {
          x: 400,
          y: 400
        },
        {
          x: 200,
          y: 200
        },
        {
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

  const handleAddElement = (newEl: ICurve) => {
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
