import { Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Editor, Login, ProtectedRoute, userAtom } from './pages';
import './index.css';

const queryClient = new QueryClient();

function App() {
  const { user } = useAtomValue(userAtom);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/editor"
        element={
          <ProtectedRoute user={user}>
            <Editor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colorScheme: 'light',
        primaryColor: 'blue',
        primaryShade: 9,
        defaultRadius: 'xs',
        components: { Button: { defaultProps: { size: 'sm', variant: 'default' } } }
      }}
    >
      <Global
        styles={(theme) => ({
          '*, *::before, *::after': { boxSizing: 'border-box' },
          body: {
            padding: 0,
            margin: 0
          }
        })}
      />
      <NotificationsProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <App />
          </Router>
        </QueryClientProvider>
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>
);
