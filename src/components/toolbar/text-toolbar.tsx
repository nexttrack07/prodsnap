import {
  Group,
  ActionIcon,
  NumberInput,
  NumberInputHandlers,
  ColorPicker,
  Popover,
  Box,
  Menu,
  SegmentedControl,
  Slider,
  DEFAULT_THEME
} from "@mantine/core";
import { activeElementAtomAtom, MoveableElement, selectedItemsAtom, TextType } from "../canvas/store";
import { atom, useAtom } from "jotai";
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
import FontPicker from "font-picker-react";


const textPropsAtom = atom(
  (get) => {
    const activeElementAtom = get(activeElementAtomAtom);
    if (!activeElementAtom) return null;
    const activeElement = get(activeElementAtom);
    return (activeElement as MoveableElement & TextType).props;
  },
  (get, set, update: React.CSSProperties) => {
    const activeElementAtom = get(activeElementAtomAtom);
    if (!activeElementAtom) return;
    set(activeElementAtom, (el) => {
      if (el.type === "text") {
        return { ...el, props: { ...el.props, ...update } };
      }
      return el;
    });
  }
);

export function TextToolbar() {
  const [textProps, setTextProps] = useAtom(textPropsAtom);
  const handlers = useRef<NumberInputHandlers>();

  if (!textProps) return null;

  return (
    <Group>
      <FontPicker
        apiKey={import.meta.env.VITE_GOOGLE_FONTS_API_KEY}
        activeFontFamily={textProps.fontFamily}
        onChange={(font) => setTextProps({ fontFamily: font.family ?? "" })}
      />
      <Popover>
        <Popover.Target>
          <ActionIcon size={36}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: textProps.color,
                borderRadius: 3,
                border: "1px solid #ccc",
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={textProps.color}
            onChange={(val) => setTextProps({ color: val })}
            swatches={[
              ...DEFAULT_THEME.colors.red,
              ...DEFAULT_THEME.colors.yellow,
              ...DEFAULT_THEME.colors.green,
              ...DEFAULT_THEME.colors.blue,
            ]}
          />
        </Popover.Dropdown>
      </Popover>
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
          step={1}
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
      <Group spacing='xs'>
        <ActionIcon
          size={36}
          color="dark"
          variant={textProps.fontWeight === "bolder" ? "light" : "subtle"}
          onClick={() =>
            setTextProps({
              fontWeight:
                textProps.fontWeight === "bolder" ? "normal" : "bolder",
            })
          }
        >
          <Bold />
        </ActionIcon>
        <ActionIcon
          size={36}
          color="dark"
          variant={textProps.fontStyle === "italic" ? "light" : "subtle"}
          onClick={() =>
            setTextProps({
              fontStyle:
                textProps.fontStyle === "italic" ? "normal" : "italic",
            })
          }
        >
          <Italic />
        </ActionIcon>
        <ActionIcon
          size={36}
          color="dark"
          variant={
            textProps.textDecoration === "underline" ? "light" : "subtle"
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
        </ActionIcon>
        <ActionIcon
          size={36}
          color="dark"
          variant={
            textProps.textTransform === "uppercase" ? "light" : "subtle"
          }
          onClick={() =>
            setTextProps({
              textTransform:
                textProps.textTransform === "uppercase"
                  ? "none"
                  : "uppercase",
            })
          }
        >
          <TextSize />
        </ActionIcon>
      </Group>
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
              max={50}
              step={0.5}
              label={(l) => l.toFixed(1)}
            />
          </Menu.Item>
          <Menu.Label>Line Height</Menu.Label>
          <Menu.Item>
            <Slider
              disabled
              onChange={(val) => setTextProps({ lineHeight: val })}
              value={textProps.lineHeight as number}
            />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
