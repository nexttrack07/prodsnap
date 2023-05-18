import { Text, Space, createStyles, SimpleGrid } from '@mantine/core';
import React from 'react';
import { atom, useSetAtom } from 'jotai';
import { addElementAtom, MoveableElement, SVGCurveType } from '../../components/canvas/store';
import {
  Curve,
  DefaultCurve,
  Dimension,
  Element,
  ElementAtom,
  ElementGroup,
  PointAtom,
  Position,
  Rotation,
  elementGroupAtomsAtom
} from '@/stores/elements';

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

type PointCurveType = Position & Rotation & Dimension & DefaultCurve;

const data: { id: number; prev: string; data: PointCurveType }[] = [
  {
    id: 0,
    prev: 'M 0 0 L 50 0',
    data: {
      type: 'curve',
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      angle: 0,
      pathProps: {
        strokeWidth: 2,
        stroke: 'black'
      },
      markerProps: {
        startMarker: 'none',
        markerSize: 10,
        endMarker: 'none'
      },
      points: [
        {
          type: 'point',
          x: 100,
          y: 100
        },
        {
          type: 'point',
          x: 200,
          y: 200
        },
        {
          type: 'point',
          x: 500,
          y: 100
        }
      ]
    }
  }
];

export function CurvesPanel() {
  const addElement = useSetAtom(addElementAtom);
  const setElementGroupAtoms = useSetAtom(elementGroupAtomsAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: PointCurveType) => {
    const newElement: Element = {
      ...newEl,
      points: newEl.points.map((p) => atom(p))
    };
    // const newElement: Element = newEl.points.map((p) => atom(p));
    const newElementGroup: ElementGroup = {
      type: 'group',
      angle: 0,
      elements: [atom(newElement)] as ElementAtom[]
    };

    setElementGroupAtoms((prev) => [...prev, atom(newElementGroup)]);
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
