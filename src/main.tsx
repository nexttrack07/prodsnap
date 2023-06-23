import { Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Editor, Login, ProtectedRoute } from './pages';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/editor"
        element={
          <ProtectedRoute>
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
        primaryColor: 'dark',
        primaryShade: 6,
        defaultRadius: 'xs',
        components: { Button: { defaultProps: { size: 'sm', variant: 'default' } } },
        defaultGradient: { deg: 45, from: 'dark', to: 'gray.7' }
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
      <ClerkProvider publishableKey={import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY}>
        <NotificationsProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <App />
            </Router>
          </QueryClientProvider>
        </NotificationsProvider>
      </ClerkProvider>
    </MantineProvider>
  </React.StrictMode>
);
