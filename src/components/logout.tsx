import { useLoginStore } from '@/stores';
import { Flex } from '@mantine/core';
import { Logout } from 'tabler-icons-react';

export function LogoutComponent() {
  const setUser = useLoginStore((state) => state.setUser);
  const handleLogout = () => {};
  return (
    <Flex onClick={handleLogout} align="center" justify="space-between">
      <Logout size={15} />
      Logout
    </Flex>
  );
}
