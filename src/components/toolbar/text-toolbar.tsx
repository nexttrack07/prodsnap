import {
  Select,
  Group,
  ActionIcon,
  NumberInput,
  NumberInputHandlers,
  ColorInput,
  Menu,
  Button,
  SegmentedControl,
  Slider,
} from "@mantine/core";
import {
  elementState,
  selectedElementsAtom,
  selectedElementIdsState,
  TextType,
  activeElementState,
} from "../canvas/element.store";
import React, { useRef } from "react";
import {
  AlignCenter,
  AlignJustified,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  TextSize,
  Underline,
} from "tabler-icons-react";
import { DefaultValue, selector, useRecoilState } from "recoil";

const fonts = [
  "Roboto",
  "Helvetica",
  "Oswald",
  "Nunito",
  "Times New Roman",
  "Arial",
  "Comic sans",
];

const textPropsSelector = selector({
  key: "text-props",
  get: ({ get }) => {
    const selectedElementId = get(activeElementState);
    if (selectedElementId === -1) return null;
    const selectedElement = get(elementState(selectedElementId));
    return (selectedElement as TextType).props;
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;
    const selectedElementId = get(activeElementState);
    set(elementState(selectedElementId), (el) => {
      if (el.type === "text") {
        return { ...el, props: { ...el.props, ...newVal } };
      }
      return el;
    });
  },
});

export function TextToolbar() {
  const [textProps, setTextProps] = useRecoilState(textPropsSelector);
  const handlers = useRef<NumberInputHandlers>();

  if (!textProps) return null;

  return (
    <Group>
      <Select
        data={fonts}
        placeholder="Font Family"
        value={textProps.fontFamily}
        searchable
        nothingFound="No options"
        onChange={(fontFamily) =>
          setTextProps({ fontFamily: fontFamily ?? "" })
        }
      />
      <ColorInput
        format="hex"
        sx={{ input: { width: 120 } }}
        value={textProps.color}
        onChange={(color) => setTextProps({ color })}
        swatches={[
          "#25262b",
          "#868e96",
          "#fa5252",
          "#e64980",
          "#be4bdb",
          "#7950f2",
          "#4c6ef5",
          "#228be6",
          "#15aabf",
          "#12b886",
          "#40c057",
          "#82c91e",
          "#fab005",
          "#fd7e14",
        ]}
      />
      <Menu closeOnItemClick={false} shadow="md" width={250}>
        <Menu.Target>
          <ActionIcon variant="default" size={36}>
            <TextSize />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Font Size</Menu.Label>
          <Menu.Item>
            <Group spacing={5}>
              <ActionIcon
                size={36}
                variant="default"
                onClick={() => handlers.current?.decrement()}
              >
                –
              </ActionIcon>

              <NumberInput
                hideControls
                value={textProps.fontSize ? +textProps.fontSize : 0}
                onChange={(val) => setTextProps({ fontSize: val })}
                handlersRef={handlers}
                max={200}
                min={10}
                step={5}
                styles={{ input: { width: 54, textAlign: "center" } }}
              />

              <ActionIcon
                size={36}
                variant="default"
                onClick={() => handlers.current?.increment()}
              >
                +
              </ActionIcon>
            </Group>
          </Menu.Item>
          <Menu.Label>Font Style</Menu.Label>
          <Menu.Item>
            <Button.Group>
              <Button
                variant="light"
                color={textProps.fontWeight === "bolder" ? "blue" : "dark"}
                onClick={() =>
                  setTextProps({
                    fontWeight:
                      textProps.fontWeight === "bolder" ? "normal" : "bolder",
                  })
                }
              >
                <Bold />
              </Button>
              <Button
                variant="light"
                color={textProps.fontStyle === "italic" ? "blue" : "dark"}
                onClick={() =>
                  setTextProps({
                    fontStyle:
                      textProps.fontStyle === "italic" ? "normal" : "italic",
                  })
                }
              >
                <Italic />
              </Button>
              <Button
                variant="light"
                color={
                  textProps.textDecoration === "underline" ? "blue" : "dark"
                }
                onClick={() =>
                  setTextProps({
                    textDecoration:
                      textProps.textDecoration === "underline"
                        ? "none"
                        : "underline",
                  })
                }
              >
                <Underline />
              </Button>
            </Button.Group>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu closeOnItemClick={false}>
        <Menu.Target>
          <ActionIcon variant="default" size={36}>
            <AlignCenter />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Text Align</Menu.Label>
          <Menu.Item>
            <SegmentedControl
              onChange={(val) =>
                setTextProps({
                  textAlign: val as React.CSSProperties["textAlign"],
                })
              }
              data={[
                { label: <AlignLeft />, value: "left" },
                { label: <AlignCenter />, value: "center" },
                { label: <AlignRight />, value: "right" },
                { label: <AlignJustified />, value: "justify" },
              ]}
            />
          </Menu.Item>
          <Menu.Label>Letter Spacing</Menu.Label>
          <Menu.Item>
            <Slider
              onChange={(val) => setTextProps({ letterSpacing: val })}
              value={textProps.letterSpacing as number}
              min={0}
              max={10}
              step={0.1}
              label={(l) => l.toFixed(1)}
            />
          </Menu.Item>
          <Menu.Label>Line Height</Menu.Label>
          <Menu.Item>
            <Slider
              onChange={(val) => setTextProps({ lineHeight: val })}
              value={textProps.lineHeight as number}
            />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
