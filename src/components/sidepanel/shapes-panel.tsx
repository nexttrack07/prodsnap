import React from 'react';
import { Text, Space, createStyles, SimpleGrid, ScrollArea } from '@mantine/core';
import { atom, useAtom, useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { getShapes } from '../../api';
import { addElementAtom, CanvasElementWithPointAtoms } from '../../components/canvas/store';
import { scalePathData } from '../canvas/render-path';
import { Element, ElementGroup, elementGroupAtomsAtom } from '@/stores/elements';

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

export function ShapesPanel() {
  const query = useQuery(['shapes'], getShapes);
  // const addElement = useSetAtom(addElementAtom);
  const [elementGroupAtoms, setElementGroupAtoms] = useAtom(elementGroupAtomsAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: Element) => {
    const newElementGroup: ElementGroup = {
      type: 'group',
      angle: 0,
      elements: [atom(newEl)]
    };
    setElementGroupAtoms((prev) => [...prev, atom(newElementGroup)]);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Shapes
      </Text>
      <Space h="xl" />
      <ScrollArea style={{ height: 700 }}>
        <SimpleGrid cols={4}>
          {query.data?.data?.map((item) => {
            const element = item.data;
            const {
              pathProps: { strokeWidth = 1 },
              width,
              height
            } = element;
            const pathData = scalePathData(
              element.pathProps.d!,
              width,
              height,
              Number(strokeWidth) ?? 1
            );
            return (
              <svg
                key={item.id}
                onClick={() => handleAddElement(element)}
                className={classes.shape}
                fill={element.svgProps.fill}
                stroke={element.svgProps.stroke}
                viewBox={`${-strokeWidth} ${-strokeWidth} ${width + +strokeWidth}, ${
                  height + +strokeWidth
                }`}
              >
                <clipPath id={element.clipPathId}>
                  <path
                    d={pathData}
                    vectorEffect="non-scaling-stroke"
                    stroke="transparent"
                    strokeWidth={element.pathProps.strokeWidth}
                  />
                </clipPath>
                <path
                  d={pathData}
                  stroke={element.pathProps.stroke}
                  strokeWidth={element.pathProps.strokeWidth}
                  strokeLinecap={element.pathProps.strokeLinecap}
                  strokeDasharray={element.pathProps.strokeDasharray}
                  // strokeMiterlimit={element.pathProps.strokeWidth * 2}
                  clipPath={element.clipPathId}
                  fill={element.pathProps.fill}
                  // fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            );
          })}
        </SimpleGrid>
      </ScrollArea>
    </>
  );
}
