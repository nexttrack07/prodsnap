import React from "react";
import { Text, Space, createStyles, SimpleGrid, Center } from "@mantine/core";
import { useRecoilCallback, useRecoilState } from "recoil";
import {
  elementGroupsState,
  elementState,
  elementsState,
  Element,
} from "../canvas/element.store";
import { Textfit } from "react-textfit";

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: "pointer",
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: "0 0 1px rgba(0,0,0,0.3)",
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    padding: 8,
    "&:hover": {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s",
    },
  },
}));

const data: Element[] = [
  {
    x: 100,
    y: 200,
    type: "text",
    content: "Heading",
    width: 200,
    height: 50,
    props: {
      fontSize: 40,
      color: "#000",
    },
  },
  {
    x: 100,
    y: 200,
    type: "text",
    content: "Sub heading",
    width: 230,
    height: 30,
    props: {
      color: "#000",
      fontSize: 30,
    },
  },
  {
    x: 100,
    y: 200,
    type: "text",
    content: "Paragraph",
    width: 220,
    height: 30,
    props: {
      color: "#000",
      fontSize: 20,
    },
  },
];

const templateData: Element[][] = [
  [
    {
      x: 100,
      y: 150,
      type: "text",
      content: "Add another heading",
      width: 250,
      height: 50,
      props: {
        color: "#000",
        fontSize: 30,
      },
    },
    {
      x: 100,
      y: 200,
      type: "text",
      content: "Add a heading here",
      width: 250,
      height: 55,
      props: {
        color: "#000",
        fontSize: 20,
      },
    },
  ],
];

export function TextPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const { classes } = useStyles();

  const handleAddElement = useRecoilCallback(
    ({ set }) =>
      (item: Element) => {
        const newId = elements.length;
        setElements((ids) => [...ids, newId]);
        set(elementState(newId), item);
      },
    [elements]
  );
  const handleAddGroup = useRecoilCallback(
    ({ set }) =>
      (els: Element[]) => {
        els.forEach((newEl, i) => {
          const newId = elements.length + i;
          setElements((ids) => [...ids, newId]);
          set(elementState(newId), newEl);
        });
        set(elementGroupsState, (ids) => [
          ...ids,
          els.map((_, i) => elements.length + i),
        ]);
      },
    [elements]
  );

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Text
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={1}>
        {data.map((item, i) => {
          if (item.type === "text") {
            return (
              <Center
                key={i}
                onClick={() => handleAddElement(item)}
                className={classes.shape}
              >
                <Text style={{ ...item.props }}>
                  <Textfit mode="single">{item.content}</Textfit>
                </Text>
              </Center>
            );
          }
          return null;
        })}
        {templateData.map((item, i) => {
          return (
            <Center
              key={i}
              onClick={() => handleAddGroup(item)}
              className={classes.shape}
            >
              {item.map((el) => {
                if (el.type === "text") {
                  return (
                    <Text key={el.content} style={{ ...el.props }}>
                      <Textfit mode="single">{el.content}</Textfit>
                    </Text>
                  );
                }
                return null;
              })}
            </Center>
          );
        })}
      </SimpleGrid>
    </>
  );
}
