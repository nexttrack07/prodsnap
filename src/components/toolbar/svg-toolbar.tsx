import { SVGAttributes } from 'react';
import { ActionIcon, ColorPicker, Group, Popover, DEFAULT_THEME, Menu, Slider, SegmentedControl } from "@mantine/core";
import { elementsAtom, MoveableElement, selectedElementsAtom, SVGType } from "../canvas/store";
import { atom, useAtom } from "jotai";
import { BorderAll, BorderNone, BorderRadius, BorderStyle2 } from 'tabler-icons-react';

const svgPropsAtom = atom(
  (get) => {
    const selectedElementId = get(selectedElementsAtom);
    const selectedElementAtom = get(elementsAtom)[selectedElementId[0]];
    const selectedElement = get(selectedElementAtom);

    return (selectedElement as MoveableElement & SVGType).props;
  },
  (get, set, update: SVGAttributes<SVGSVGElement>) => {
    const selectedElementId = get(selectedElementsAtom);
    const selectedElementAtom = get(elementsAtom)[selectedElementId[0]];
    set(selectedElementAtom, (el) => {
      if (el.type === "svg") {
        return { ...el, props: { ...el.props, ...update } };
      }
      return el;
    });
  }
);


export function SvgToolbar() {
  const [props, setProps] = useAtom(svgPropsAtom);

  return (
    <Group>
      <Popover>
        <Popover.Target>
          <ActionIcon variant="default" size={42}>
            <svg width="32" height="32">
              <rect stroke={props?.stroke} strokeWidth="15" fill="none" width="32" height="32" />
            </svg>
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={props?.stroke}
            onChange={val => setProps({ stroke: val, strokeWidth: props?.strokeWidth ?? 10 })}
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
          <ActionIcon variant="default" size={42}>
            <svg width="32" height="32">
              <rect fill={props?.fill} strokeWidth="1" stroke="none" width="32" height="32" />
            </svg>
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            format="rgba"
            value={props?.fill}
            onChange={val => setProps({ fill: val })}
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
              data={[
                { label: <BorderNone />, value: "none" },
                { label: <BorderStyle2 />, value: "dashed" },
                { label: <BorderAll />, value: "all" },
              ]}
            />
          </Menu.Item>
          <Menu.Label>Border Width</Menu.Label>
          <Menu.Item>
            <Slider value={props?.strokeWidth as number} onChange={strokeWidth => setProps({ strokeWidth })} />
          </Menu.Item>
          <Menu.Label>Rounded Corner</Menu.Label>
          <Menu.Item>
            <Slider disabled />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
