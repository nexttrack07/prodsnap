import { Header, useMantineTheme, Button, Stack, AppShell, Footer, Text, Navbar } from "@mantine/core";
import { useState } from "react";
import { Template, Camera, PhotoEdit, TextCaption, Line, Shape, ChartInfographic } from 'tabler-icons-react';
import { Logo } from "../components";

const HEADER_SIZE = 60;
const FOOTER_SIZE = 60;
const SIDEBAR_SIZE = 60;
const SIDEPANEL_SIZE = 300 + SIDEBAR_SIZE;

function HeaderComponent() {
  return (
    <Header height={HEADER_SIZE} p="xs">
      <Logo />
    </Header>
  )
}

const navItems = [
  { icon: Template, label: 'Template' },
  { icon: Camera, label: 'Upload' },
  { icon: PhotoEdit, label: 'Photos' },
  { icon: TextCaption, label: 'Text' },
  { icon: Line, label: 'Line' },
  { icon: Shape, label: 'Shape' },
  { icon: ChartInfographic, label: 'Graphics' },
];

function NavbarComponent() {
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();

  return (
    <Navbar width={{ base: SIDEPANEL_SIZE }}>
      <Stack spacing="xl" sx={theme => ({ width: SIDEBAR_SIZE, height: "100%", borderRight: "1px solid", borderColor: theme.colors.gray[2] })} justify="flex-start">
        {navItems.map((item, index) => (
          <>
            <Button
              key={item.label}
              onClick={() => setActive(index)}
              variant="subtle"
              color={active === index ? "blue" : "dark"}
            >
              <item.icon strokeWidth={1.5} />
            </Button>
          </>
        ))}
      </Stack>
    </Navbar>
  )
}

function FooterComponent() {
  return (
    <Footer height={FOOTER_SIZE} p="xs">
      <Text>Application Footer</Text>
    </Footer>
  )
}

export function Editor() {
  return (
    <AppShell navbar={<NavbarComponent />} header={<HeaderComponent />} footer={<FooterComponent />}>
      <Text>Application goes here!</Text>
    </AppShell>
  )
}