import React, { useRef, useState } from "react";
import {
  ActionIcon,
  ColorPicker,
  Group,
  Popover,
  DEFAULT_THEME,
  NumberInput,
  NumberInputHandlers,
  Box,
  SegmentedControl,
  Grid,
} from "@mantine/core";
import {
  MoveableElement,
  activeElementAtomAtom,
  SVGCurveType,
} from "../canvas/store";
import { atom, useAtom } from "jotai";
import { Line, LineDashed, LineDotted } from "tabler-icons-react";

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

export const START_MARKERS = {
  none: (<>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5 12v-.75h16a.75.75 0 0 1 0 1.5H5V12z"
      clipRule="evenodd"
    />
    <path fill="currentColor" d="M5 9.5v5L3 12l2-2.5z" />
  </>),
  "outline-arrow": (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.97 12.53a.75.75 0 0 1 0-1.06l4.773-4.773a.75.75 0 0 1 1.06 1.06L5.311 11.25H20.5a.75.75 0 0 1 0 1.5H5.31l3.493 3.493a.75.75 0 1 1-1.06 1.06L2.97 12.53z"
        clipRule="evenodd"
      />
    </>
  ),
  "fill-arrow": (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M2.624 11.584a.5.5 0 0 0 0 .832l7.599 5.066a.5.5 0 0 0 .777-.416V6.934a.5.5 0 0 0-.777-.416l-7.599 5.066z"
      />
    </>
  ),
  "outline-circle": (
    <>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM7 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
        clipRule="evenodd"
      />
    </>
  )
} as const;

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

      <SegmentedControl
        value={props.strokeDasharray ?? ""}
        onChange={(val) => setProps({ strokeDasharray: val ?? '' })}
        data={[
          { label: <Line />, value: '' },
          { label: <LineDashed />, value: '21,7' },
          { label: <LineDotted />, value: '7,7' },
        ]}
      />

      <Popover withArrow shadow="sm">
        <Popover.Target>
          <ActionIcon variant="default" size={36}>
            <svg width={24} height={24}>
              {START_MARKERS[props.startMarker]}
            </svg>
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Grid gutter="xs" justify="center" align="center">
            {Object.entries(START_MARKERS).map(([id, comp]) => (
              <Grid.Col key={id} span="content">
                <ActionIcon onClick={() => setProps({ startMarker: id })} size={36}>
                  <svg width={24} height={24}>
                    {comp}
                  </svg>
                </ActionIcon>
              </Grid.Col>
            ))}
          </Grid>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
