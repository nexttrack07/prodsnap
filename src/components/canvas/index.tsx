import React from "react";
import { Box, DEFAULT_THEME, Center } from "@mantine/core";
import { createElement, ReactNode } from "react";
import { SVGType } from "./store";
import { RenderImage } from "./render-image";
import { RenderText } from "./render-text";
import { useKeyPress } from "../../utils/use-key-press";
import {
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  Element,
  elementsState,
  elementGroupsState,
  elementState,
  isElementSelectedState,
  selectedElementIdsState,
  activeElementState,
} from "./element.store";
import { SelectHandler } from "./select-handler";
import { RenderPath } from "./render-path";

export function Canvas() {
  const elements = useRecoilValue(elementsState);
  const [elementGroups, setElementGroups] = useRecoilState(elementGroupsState);

  return (
    <Box
      id="canvas"
      sx={(theme) => ({
        width: 1100,
        height: 700,
        border: `1px solid ${theme.colors.gray[3]}`,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.3)",
        position: "relative",
        backgroundColor: "white",
      })}
    >
      {elements.map((i) => (
        <ElementComponent i={i} key={i} />
      ))}
      {elementGroups.map((group, i) => (
        <ElementGroup key={i} elementGroup={group} />
      ))}
      <SelectHandler />
    </Box>
  );
}

export function renderElement(
  item: SVGType["elements"][number],
  i: number
): ReactNode {
  const { tag, props } = item;

  return createElement(tag, { ...props, key: i }, null);
}

const selectedElementSpecs = selectorFamily({
  key: "element-group-specs",
  get:
    (elementGroup: number[]) =>
    ({ get }) => {
      const { minX, minY, maxX, maxY } = elementGroup.reduce(
        (acc, id) => {
          const element: Element = get(elementState(id));

          return {
            minX: Math.min(acc.minX, element.x),
            minY: Math.min(acc.minY, element.y),
            maxX: Math.max(acc.maxX, element.x + element.width),
            maxY: Math.max(acc.maxY, element.y + element.height),
          };
        },
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      );

      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    },
});

const elementCompMap: Record<Element["type"], React.FC<any>> = {
  image: RenderImage,
  text: RenderText,
  shape: RenderPath,
};

const elementsFromGroupAtom = selectorFamily({
  key: "elements-from-group",
  get:
    (ids: number[]) =>
    ({ get }) => {
      return ids.map((id) => get(elementState(id)));
    },
});

function ElementGroup({ elementGroup }: { elementGroup: number[] }) {
  const { x, y, width, height } = useRecoilValue(
    selectedElementSpecs(elementGroup)
  );
  const isShiftPressed = useKeyPress("Shift");
  const setSelectedElements = useSetRecoilState(selectedElementIdsState);
  const elements = useRecoilValue(elementsFromGroupAtom(elementGroup));
  const [activeElement, setActiveElement] = useRecoilState(activeElementState);

  const handleSelectGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElements((items) => {
      if (isShiftPressed) {
        return items
          .filter((i) => !elementGroup.includes(i))
          .concat(elementGroup);
      } else {
        return elementGroup;
      }
    });
  };

  return (
    <div
      style={{
        userSelect: "none",
        left: x,
        top: y,
        width,
        height,
        position: "absolute",
      }}
      onClick={handleSelectGroup}
    >
      {elements.map((el, i) =>
         (
          <Box
            key={i}
            onClick={() => setActiveElement(elementGroup[i])}
            sx={{
              left: el.x - x,
              top: el.y - y,
              position: "absolute",
              width: el.width,
              height: el.height,
              borderStyle: "solid",
              borderColor: DEFAULT_THEME.colors.blue[7],
              borderWidth: activeElement === elementGroup[i] ? 3 : 0,
              "&:hover": {
                borderWidth: 3,
              },
            }}
          />
        )
      )}
    </div>
  );
}

function ElementComponent({ i }: { i: number }) {
  const [element, setElement] = useRecoilState(elementState(i));
  const setSelectedElements = useSetRecoilState(selectedElementIdsState);
  const setActiveElement = useSetRecoilState(activeElementState);
  const isSelected = useRecoilValue(isElementSelectedState(i));
  const isShiftPressed = useKeyPress("Shift");

  const handleElementSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElements((items) => {
      if (isShiftPressed) {
        return items.includes(i) ? items : items.concat(i);
      } else {
        return [i];
      }
    });
    setActiveElement(i);
  };

  const Comp = elementCompMap[element.type];

  return (
    <span
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        userSelect: "none",
        cursor: "pointer",
      }}
      onClick={handleElementSelect}
    >
      <Comp element={element} setElement={setElement} isSelected={isSelected} />
    </span>
  );
}
