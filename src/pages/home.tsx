import React from 'react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createClient } from '@supabase/supabase-js';
import { Center, Paper } from '@mantine/core';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_ANON_API_KEY
);

export function Home() {
  return (
    <div style={{ height: '100vh' }}>
      <Center sx={{ height: '100vh' }}>
        <Paper withBorder shadow="xs" p="xl">
          <Auth supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }} />
        </Paper>
      </Center>
    </div>
  )
}