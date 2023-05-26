import { useLoginStore } from '@/stores';
import { auth } from '@/utils/firebase';
import { Flex } from '@mantine/core';
import { signOut } from 'firebase/auth';
import { Logout } from 'tabler-icons-react';

export function LogoutComponent() {
  const setUser = useLoginStore((state) => state.setUser);
  const handleLogout = () => {
    // logout of firebase
    signOut(auth).then(() => {
      setUser(null);
    });
  };
  return (
    <Flex onClick={handleLogout} align="center" justify="space-between">
      <Logout size={15} />
      Logout
    </Flex>
  );
}
