import React from 'react';
import { Text, Space, createStyles, SimpleGrid, ScrollArea } from '@mantine/core';
import { useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { getShapes } from '../../api';
import { addElementAtom, CanvasElementWithPointAtoms } from '../../components/canvas/store';
import { scalePathData } from '../canvas/render-path';

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
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Shapes
      </Text>
      <Space h="xl" />
      <ScrollArea style={{ height: 700 }}>
        <SimpleGrid cols={3}>
          {query.data?.data?.map((item) => {
            const element = item.data;
            const {
              strokeProps: { strokeWidth },
              width,
              height
            } = element;
            const pathData = scalePathData(element.path.d!, width, height, strokeWidth);
            return (
              <svg
                key={item.id}
                onClick={() => handleAddElement(element)}
                className={classes.shape}
                opacity={element.opacity}
                viewBox={`${-strokeWidth} ${-strokeWidth} ${width + strokeWidth}, ${
                  height + strokeWidth
                }`}
              >
                <clipPath id={element.strokeProps.clipPathId}>
                  <path
                    d={pathData}
                    vectorEffect="non-scaling-stroke"
                    stroke="transparent"
                    strokeWidth={element.strokeProps.strokeWidth}
                  />
                </clipPath>
                <path
                  d={pathData}
                  stroke={element.strokeProps.stroke}
                  strokeWidth={element.strokeProps.strokeWidth}
                  strokeLinecap={element.strokeProps.strokeLinecap}
                  strokeDasharray={element.strokeProps.strokeDasharray}
                  // strokeMiterlimit={element.strokeProps.strokeWidth * 2}
                  clipPath={element.strokeProps.clipPathId}
                  fill={element.props.fill}
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
