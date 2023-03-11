import React from 'react'
import { Text, Space, createStyles, SimpleGrid, Button, DEFAULT_THEME } from "@mantine/core";
import { atom, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getShapes } from "../../api";
import { CanvasElement, addElementAtom, addElementsAtom, MoveableElement, SVGType, SVGPointLine, SVGPointType, Draggable } from "../../components/canvas/store";

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
type LineType = Omit<SVGPointLine & MoveableElement, "p1" | "p2"> & { p1: SVGPointType & Draggable; p2: SVGPointType & Draggable };
const LINE: LineType = {
  type: "svg-curve",
  p1: {
    type: "svg-point",
    x: 100,
    y: 100
  },
  p2: {
    type: "svg-point",
    x: 400,
    y: 100
  },
  stroke: 8,
  x: 100,
  y: 100,
  width: 100,
  height: 100,
}

export function ShapesPanel() {
  const query = useQuery(["shapes"], getShapes);
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    addElement(newEl);
  };

  const handleAddLine = (lineEl: LineType) => {
    const { p1, p2, ...rest } = lineEl;
    addElement({
      p1: atom(p1),
      p2: atom(p2),
      ...rest
    })
  }

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Shapes
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        {query.data?.data?.map((item) => (
          <svg
            key={item.id}
            className={classes.shape}
            width={75}
            onClick={() => handleAddElement(item.data)}
            fill={item.data.props?.fill}
            stroke={item.data.strokeProps.stroke}
            strokeWidth={item.data.strokeProps.strokeWidth}
            viewBox={item.data.props?.viewBox}
          >
            <path {...item.data.path} />
          </svg>
        ))}
        <Button onClick={() => handleAddLine(LINE)} compact variant="outline">Line</Button>
      </SimpleGrid>
    </>
  );
}
