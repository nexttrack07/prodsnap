import { SVGAttributes } from "react";
import {
  ActionIcon,
  ColorPicker,
  Group,
  Popover,
  DEFAULT_THEME,
  Menu,
  Slider,
  SegmentedControl,
  Box,
} from "@mantine/core";
import {
  elementsAtom,
  MoveableElement,
  selectedElementsAtom,
  SVGPathType,
  SVGStrokeProps,
} from "../canvas/store";
import { atom, useAtom } from "jotai";
import {
  BorderAll,
  BorderNone,
  BorderRadius,
  BorderStyle2,
} from "tabler-icons-react";

const svgPropsAtom = atom(
  (get) => {
    const selectedElementId = get(selectedElementsAtom);
    const selectedElementAtom = get(elementsAtom)[selectedElementId[0]];
    const selectedElement = get(selectedElementAtom);

    return (selectedElement as MoveableElement & SVGPathType).props;
  },
  (get, set, update: SVGAttributes<SVGSVGElement>) => {
    const selectedElementId = get(selectedElementsAtom);
    const selectedElementAtom = get(elementsAtom)[selectedElementId[0]];
    set(selectedElementAtom, (el) => {
      if (el.type === "svg-path") {
        return { ...el, props: { ...el.props, ...update } };
      }
      return el;
    });
  }
);

const svgStrokePropsAtom = atom(
  (get) => {
    const selectedElementId = get(selectedElementsAtom);
    const selectedElementAtom = get(elementsAtom)[selectedElementId[0]];
    const selectedElement = get(selectedElementAtom);

    return (selectedElement as MoveableElement & SVGPathType).strokeProps;
  },
  (get, set, update: Partial<SVGStrokeProps>) => {
    const selectedElementId = get(selectedElementsAtom);
    const selectedElementAtom = get(elementsAtom)[selectedElementId[0]];
    set(selectedElementAtom, (el) => {
      if (el.type === "svg-path") {
        return { ...el, strokeProps: { ...el.strokeProps, ...update } };
      }
      return el;
    });
  }
);

export function SvgPathToolbar() {
  const [props, setProps] = useAtom(svgPropsAtom);
  const [strokeProps, setStrokeProps] = useAtom(svgStrokePropsAtom);

  return (
    <Group>
      <Popover>
        <Popover.Target>
          <ActionIcon size={36}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderColor: strokeProps.stroke,
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
            value={strokeProps.stroke}
            onChange={(val) =>
              setStrokeProps({
                stroke: val,
                strokeWidth: strokeProps.strokeWidth ?? 10,
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
      <Popover>
        <Popover.Target>
          <ActionIcon size={36}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: props?.fill,
                borderRadius: 3,
              }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={props?.fill}
            onChange={(val) => setProps({ fill: val })}
            swatches={[
              ...DEFAULT_THEME.colors.red,
              ...DEFAULT_THEME.colors.yellow,
              ...DEFAULT_THEME.colors.green,
              ...DEFAULT_THEME.colors.blue,
            ]}
          />
        </Popover.Dropdown>
      </Popover>
      <Menu closeOnItemClick={false}>
        <Menu.Target>
          <ActionIcon size={36} variant="default">
            <BorderRadius />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Border Type</Menu.Label>
          <Menu.Item>
            <SegmentedControl
              onChange={(val) => {
                switch (val) {
                  case "none":
                    setStrokeProps({ strokeWidth: 0 });
                    return;
                  case "dashed":
                    setStrokeProps({
                      strokeDasharray: "5,10",
                      strokeWidth:
                        strokeProps.strokeWidth === 0
                          ? 10
                          : strokeProps.strokeWidth,
                    });
                    return;
                  case "all":
                    setStrokeProps({
                      strokeDasharray: "0",
                      strokeWidth:
                        strokeProps.strokeWidth === 0
                          ? 10
                          : strokeProps.strokeWidth,
                    });
                    return;
                  default:
                    return;
                }
              }}
              data={[
                { label: <BorderNone />, value: "none" },
                { label: <BorderStyle2 />, value: "dashed" },
                { label: <BorderAll />, value: "all" },
              ]}
            />
          </Menu.Item>
          <Menu.Label>Border Width</Menu.Label>
          <Menu.Item>
            <Slider
              value={strokeProps.strokeWidth}
              onChange={(strokeWidth) => setStrokeProps({ strokeWidth })}
            />
          </Menu.Item>
          <Menu.Label>Rounded Corner</Menu.Label>
          <Menu.Item>
            <Slider disabled />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
