import React from "react";
import { Box } from "@mantine/core";
import { Atom, useAtom, useAtomValue } from "jotai";
import { createElement, ReactNode, useEffect } from "react";
import { elementsAtom, ElementType, SVGType } from "./store";

export function Canvas() {
  const elements = useAtomValue(elementsAtom);

  return (
    <Box
      sx={(theme) => ({
        width: 1000,
        height: 800,
        border: `1px solid ${theme.colors.gray[3]}`,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.3)",
        position: "absolute",
      })}
    >
      {elements.map((elAtom, i) => (
        <Element key={i} elementAtom={elAtom} />
      ))}
    </Box>
  );
}

export function renderElement(item: SVGType, i: number): ReactNode {
  const { name: tag, attributes: props, children } = item;

  return createElement(
    tag,
    { ...props, key: i },
    children?.map((c, i) => renderElement(c, i))
  );
}

function Element({ elementAtom }: { elementAtom: ElementType }) {
  const [element, setElement] = useAtom(elementAtom);

  return (
    <svg
      width={element.attributes.width}
      height={element.attributes.height}
      style={{
        position: "relative",
        left: element.attributes.left,
        top: element.attributes.top,
      }}
    >
      {element.children?.map(renderElement)}
    </svg>
  );
}
