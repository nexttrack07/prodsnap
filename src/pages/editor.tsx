import { Center, AppShell, Footer, Text, Navbar } from "@mantine/core";
import React from "react";
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
  return (
    <AppShell
      navbar={
        <Navbar width={{ base: SIDEPANEL_SIZE }}>
          <Sidepanel />
        </Navbar>
      }
      header={<HeaderComponent />}
      footer={<FooterComponent />}
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
        <div style={{ height: HEADER_SIZE, backgroundColor: "blue" }}>
          <Toolbar />
        </div>
        <Center sx={{ backgroundColor: "red", flex: 1 }}>
          <Canvas />
        </Center>
      </div>
    </AppShell>
  );
}
