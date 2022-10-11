import React from "react";
import { Text, Space, createStyles, SimpleGrid, Center } from "@mantine/core";
import { atom, useSetAtom } from "jotai";
import {
  elementsAtom,
  MoveableElement,
  TextType,
  ElementType,
} from "../../components/canvas/store";

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: "pointer",
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: "0 0 1px rgba(0,0,0,0.3)",
    borderRadius: 5,
    padding: 8,
    "&:hover": {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s",
    },
  },
}));

type ElementGroupType = {
  x: number;
  y: number;
  elements: (TextType & MoveableElement)[];
};

const data: {
  id: number;
  data: ElementGroupType;
}[] = [
  {
    id: 0,
    data: {
      x: 200,
      y: 100,
      elements: [
        {
          type: "text" as const,
          width: 300,
          height: 50,
          content: "heading",
          props: {
            textTransform: "uppercase",
            fontSize: 50
          },
        },
      ],
    },
  },
];

export function TextPanel() {
  const setElements = useSetAtom(elementsAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: ElementGroupType) => {
    setElements((items) => [
      ...items,
      atom({
        ...newEl,
        elements: newEl.elements.map((el) => atom(el)) as ElementType[],
      }),
    ]);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Text
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={1}>
        {data.map((el) =>
          el.data.elements.map((item) => {
            if (item.type === "text") {
              return (
                <Center key={el.id} className={classes.shape}>
                  <Text
                    onClick={() => handleAddElement(el.data)}
                    style={{ ...item.props }}
                  >
                    {item.content}
                  </Text>
                </Center>
              );
            }
            return null;
          })
        )}
      </SimpleGrid>
    </>
  );
}
