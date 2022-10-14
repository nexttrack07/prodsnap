import React from "react";
import { Text, Space, createStyles, SimpleGrid } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getShapes } from "../../api";
import { elementsState, Element, elementState } from "../../components/canvas/element.store";
import { useRecoilCallback, useRecoilState } from "recoil";

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
  const [elements, setElements] = useRecoilState(elementsState);
  const { classes } = useStyles();

  const handleAddElement = useRecoilCallback( 
    ({ set }) =>
  (newEl: Element) => {
    const newId = elements.length;
    setElements((items) => [...items, newId]);
    set(elementState(newId), newEl)
  });

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
      </SimpleGrid>
    </>
  );
}
