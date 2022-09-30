import { Select, Group, ActionIcon, NumberInput, NumberInputHandlers, ColorInput } from "@mantine/core";
import { elementsAtom, MoveableElement, selectedElementsAtom, TextType } from "../canvas/store";
import { atom, useAtom } from "jotai";
import React, { useRef } from "react";

const fonts = [
  "Roboto",
  "Helvetica",
  "Oswald",
  "Nunito",
  "Times New Roman",
  "Arial",
  "Comic sans",
];

const textPropsAtom = atom(
  get => {
    const selectedElementId = get(selectedElementsAtom);
    const selectedElementAtom = get(elementsAtom)[selectedElementId[0]];
    const selectedElement = get(selectedElementAtom);

    return (selectedElement as MoveableElement & TextType).props;
  },
  (get, set, update: React.CSSProperties) => {
    const selectedElementId = get(selectedElementsAtom);
    const selectedElementAtom = get(elementsAtom)[selectedElementId[0]];
    set(selectedElementAtom, (el) => {
      if (el.type === "text") {
        return { ...el, props: { ...el.props, ...update } }
      }
      return el;
    })

  }
)

export function TextToolbar() {
  const [textProps, setTextProps] = useAtom(textPropsAtom);
  const handlers = useRef<NumberInputHandlers>();

  return (
    <Group>
      <Select
        data={fonts}
        placeholder="Font Family"
        value={textProps.fontFamily}
        searchable
        nothingFound="No options"
        onChange={(fontFamily) => setTextProps({ fontFamily: fontFamily ?? "" })}
      />
      <Group spacing={5}>
        <ActionIcon size={36} variant="default" onClick={() => handlers.current?.decrement()}>
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
          styles={{ input: { width: 54, textAlign: 'center' } }}
        />

        <ActionIcon size={36} variant="default" onClick={() => handlers.current?.increment()}>
          +
        </ActionIcon>
      </Group>

      <ColorInput
        format="hex"
        sx={{ input: { width: 120 } }}
        value={textProps.color}
        onChange={color => setTextProps({ color })}
        swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
      />
    </Group>
  )
}
