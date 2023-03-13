import {
  Text,
  Space,
  createStyles,
  SimpleGrid,
} from "@mantine/core";
import React from 'react';
import { atom, useSetAtom } from "jotai";
import {
  addElementAtom,
  CanvasElement,
  MoveableElement,
  SVGLineType,
} from "../../components/canvas/store";

const useStyles = createStyles(() => ({
  shape: {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s",
    },
  },
}));

const data: { id: number; prev: string; data: MoveableElement & SVGLineType }[] = [
  {
    id: 0,
    prev: "M 0 0 L 50 0",
    data: {
      type: "svg-line",
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      strokeProps: {
        strokeWidth: 2,
        stroke: 'black',
      },
      // TODO: DONT USE THIS - create atoms inside the component
      start: atom({
        type: "svg-point",
        x: 100,
        y: 100
      }),
      end: atom({
        type: "svg-point",
        x: 500,
        y: 100
      }),
    },
  },
];

const templateData = [
  {
    id: 0,
    data: [{}],
  },
];

export function CurvesPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    addElement(newEl);
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
              style={{ height: '100%', width: '100%', minHeight: 1, minWidth: 1, overflow: 'visible' }}
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
