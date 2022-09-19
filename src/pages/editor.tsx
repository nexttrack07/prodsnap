import {
  Header,
  Center,
  Avatar,
  TextInput,
  Space,
  Menu,
  Group,
  Portal,
  Divider,
  Button,
  AppShell,
  Footer,
  Text,
  Navbar,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getShapes } from "../api";
import React, { useState } from "react";
import {
  Edit,
  ArrowBack,
  ArrowForward,
  Settings,
  MessageCircle,
  Photo,
  Search,
  ArrowsLeftRight,
  Trash,
} from "tabler-icons-react";
import { Canvas, Logo, Sidepanel, SIDEPANEL_SIZE } from "../components";

export const HEADER_SIZE = 60;
export const FOOTER_SIZE = 60;

function HeaderComponent() {
  return (
    <Header sx={{ display: "flex" }} height={HEADER_SIZE} p="xs">
      <Logo />
      <Space w={100} />
      <Group>
        <Menu position="bottom-start" shadow="md" width={200}>
          <Menu.Target>
            <Button variant="subtle">File</Button>
          </Menu.Target>

          <Portal>
            <Menu.Dropdown>
              <Menu.Label>Application</Menu.Label>
              <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
              <Menu.Item icon={<Photo size={14} />}>Gallery</Menu.Item>
              <Menu.Item
                icon={<ArrowForward size={14} />}
                rightSection={
                  <Text size="xs" color="dimmed">
                    ⌘R
                  </Text>
                }
              >
                Redo
              </Menu.Item>
              <Menu.Item
                icon={<ArrowBack size={14} />}
                rightSection={
                  <Text size="xs" color="dimmed">
                    ⌘Z
                  </Text>
                }
              >
                Undo
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<ArrowsLeftRight size={14} />}>
                Transfer my data
              </Menu.Item>
              <Menu.Item color="red" icon={<Trash size={14} />}>
                Delete my account
              </Menu.Item>
            </Menu.Dropdown>
          </Portal>
        </Menu>
        <Menu position="bottom-start" shadow="md" width={200}>
          <Menu.Target>
            <Button variant="subtle">Resize</Button>
          </Menu.Target>

          <Portal>
            <Menu.Dropdown>
              <Menu.Label>Application</Menu.Label>
              <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
              <Menu.Item icon={<MessageCircle size={14} />}>Messages</Menu.Item>
              <Menu.Item icon={<Photo size={14} />}>Gallery</Menu.Item>
              <Menu.Item
                icon={<Search size={14} />}
                rightSection={
                  <Text size="xs" color="dimmed">
                    ⌘K
                  </Text>
                }
              >
                Search
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<ArrowsLeftRight size={14} />}>
                Transfer my data
              </Menu.Item>
              <Menu.Item color="red" icon={<Trash size={14} />}>
                Delete my account
              </Menu.Item>
            </Menu.Dropdown>
          </Portal>
        </Menu>
        <Divider orientation="vertical" />
        <Button variant="outline" compact>
          <ArrowBack />
        </Button>
        <Button variant="outline" compact>
          <ArrowForward />
        </Button>
        <Divider orientation="vertical" />
        <TextInput
          placeholder="Untitled Design"
          rightSection={<Edit color="gray" size={14} />}
        />
      </Group>
      <div style={{ flex: 1 }} />
      <Group>
        <Avatar color="cyan" radius="xl">
          FH
        </Avatar>
      </Group>
    </Header>
  );
}

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
    >
      <Center sx={{ width: "100%", height: "100%" }}>
        <Canvas />
      </Center>
    </AppShell>
  );
}
