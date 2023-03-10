import { Center, AppShell, Footer, Text, Navbar } from "@mantine/core";
import {
  activeElementState,
  selectedElementIdsState,
} from "../components/canvas/element.store";
import React from "react";
import { useRecoilCallback } from "recoil";
import {
  Canvas,
  Toolbar,
  Sidepanel,
  SIDEPANEL_SIZE,
  HeaderComponent,
} from "../components";

export const HEADER_SIZE = 60;
export const FOOTER_SIZE = 60;

function FooterComponent() {
  return (
    <Footer height={FOOTER_SIZE} p="xs">
      <Text>Application Footer</Text>
    </Footer>
  );
}

export function Editor() {
  const handleEditorClick = useRecoilCallback(
    ({ set }) =>
      (e: React.MouseEvent) => {
        console.log('editor clicked...', e.target, e.currentTarget)
        set(selectedElementIdsState, []);
        set(activeElementState, -1);
      },
    []
  );

  return (
    <AppShell
      navbar={
        <Navbar width={{ base: SIDEPANEL_SIZE }}>
          <Sidepanel />
        </Navbar>
      }
      header={<HeaderComponent />}
      padding={0}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: HEADER_SIZE,
            borderTop: 0,
            borderLeft: 0,
            borderRight: 0,
            borderBottom: 1,
            borderColor: "rgba(0,0,0,0.2)",
            borderStyle: "solid",
          }}
        >
          <Toolbar />
        </div>
        <Center onMouseDown={handleEditorClick} sx={{ flex: 1 }}>
          <Canvas />
        </Center>
      </div>
    </AppShell>
  );
}
