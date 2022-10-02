import React from "react";
import {
  Text,
  Space,
  createStyles,
  SimpleGrid,
  Image,
  Center,
} from "@mantine/core";
import { atom, useSetAtom } from "jotai";
import {
  elementsAtom,
  CanvasElement,
  MoveableElement,
  ImageType,
  TextType,
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

const data: { id: number; data: MoveableElement & SVGLineType }[] = [
  {
    id: 0,
    data: {
      type: "svg-line",
      x: 200,
      y: 200,
      width: 100,
      height: 3,
      props: {
        stroke: "#000",
        fill: "#000",
        style: {
          minHeight: 1,
          minWidth: 1,
          width: "100%",
          height: "100%",
          overflow: "visible",
        },
      },
      line: {
        x1: 0,
        x2: 100,
        y1: 0,
        y2: 0,
        strokeLinecap: "butt",
        fill: "none",
      },
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
  const setElements = useSetAtom(elementsAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    setElements((items) => [...items, atom(newEl)]);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Lines
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        {data.map((item) => (
          <div>
            <svg
              key={item.id}
              className={classes.shape}
              fill="#000"
              stroke="#000"
              width="100%"
              height="100%"
              onClick={() => handleAddElement(item.data)}
            >
              <g transform="scale(1) translate(0, 0.5)">
                <line {...item.data.line} />
              </g>
            </svg>
          </div>
        ))}
      </SimpleGrid>
    </>
  );
}
