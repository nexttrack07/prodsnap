// import { useLoginStore } from '@/stores';
import { logout } from '@/api/auth';
import { Flex } from '@mantine/core';
import { Logout } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';

export function LogoutComponent() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <Flex onClick={handleLogout} align="center" justify="space-between">
      <Logout size={15} />
      Logout
    </Flex>
  );
}
