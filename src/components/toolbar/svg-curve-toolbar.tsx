import React, { useRef } from "react";
import {
  ActionIcon,
  ColorPicker,
  Group,
  Popover,
  DEFAULT_THEME,
  NumberInput,
  NumberInputHandlers,
  Box,
} from "@mantine/core";
import {
  MoveableElement,
  activeElementAtomAtom,
  SVGCurveType,
} from "../canvas/store";
import { atom, useAtom } from "jotai";

const svgPropsAtom = atom(
  (get) => {
    const selectedElementAtom = get(activeElementAtomAtom);
    if (!selectedElementAtom) return null;
    const selectedElement = get(selectedElementAtom);

    return (selectedElement as MoveableElement & SVGCurveType);
  },
  (get, set, update: { stroke?: string, strokeWidth?: number }) => {
    const selectedElementAtom = get(activeElementAtomAtom);
    if (!selectedElementAtom) return;
    set(selectedElementAtom, (el) => {
      if (el.type === "svg-curve") {
        return { ...el, ...update };
      }
      return el;
    });
  }
);


export function SvgCurveToolbar() {
  const handlers = useRef<NumberInputHandlers>();
  const [props, setProps] = useAtom(svgPropsAtom);

  if (!props) return null;

  return (
    <Group>
      <Popover>
        <Popover.Target>
          <ActionIcon size={36}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderColor: props.stroke,
                borderWidth: 8,
                borderStyle: "solid",
                borderRadius: 3,
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={props.stroke}
            onChange={(val) =>
              setProps({
                stroke: val,
              })
            }
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
          value={props.strokeWidth}
          onChange={(val) => setProps({ strokeWidth: val })}
          handlersRef={handlers}
          max={50}
          min={1}
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
    </Group>
  );
}
