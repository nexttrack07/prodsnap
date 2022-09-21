import React from "react";
import { Text, Space, createStyles, SimpleGrid } from "@mantine/core";
import { atom, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getShapes } from "../../api";
import { renderElement } from "../../components/canvas";
import { elementsAtom, CanvasElement } from "../../components/canvas/store";

const useStyles = createStyles(() => ({
  shape: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s"
    },
  },
}));

export function ShapesPanel() {
  const query = useQuery(["shapes"], getShapes);
  const setElements = useSetAtom(elementsAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    setElements((items) => [...items, atom(newEl)]);
  };

  console.log('query: ', query)

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
            height={
              (item.data.height * 75) / item.data.width
            }
          >
            {item.data.elements.map(renderElement)}
          </svg>
        ))}
      </SimpleGrid>
    </>
  );
}
