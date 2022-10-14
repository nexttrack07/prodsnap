import React from 'react';
import { ActionIcon, ColorPicker, Group, Popover, DEFAULT_THEME, Menu, Slider, SegmentedControl } from "@mantine/core";
import { BorderAll, BorderNone, BorderRadius, BorderStyle2 } from 'tabler-icons-react';
import { DefaultValue, selector, useRecoilState } from 'recoil';
import { activeElementState, elementState, selectedElementIdsState, ShapeType } from '../canvas/element.store';

const svgPropsAtom = selector({
  key: "svg-props-atom",
  get: ({ get }) => {
    const activeElement = get(activeElementState);
    const selectedElement = get(elementState(activeElement));

    return (selectedElement as ShapeType).props;
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;
    const elementId = get(activeElementState)
    set(elementState(elementId), el => {
      if (el.type === "shape") {
        return { ...el, props: { ...el.props, ...newVal }};
      }

      return el;
    })
  }
})


export function SvgToolbar() {
  const [props, setProps] = useRecoilState(svgPropsAtom);

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
