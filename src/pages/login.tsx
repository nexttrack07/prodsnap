import React, { useEffect } from 'react';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Center,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  ButtonProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Alert
} from '@mantine/core';
import { BrandGoogle } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { useLoginStore } from '@/stores';
import { signInWithEmailAndPassword } from '@/api/user';

export function GoogleButton(props: ButtonProps) {
  return (
    <Button leftIcon={<BrandGoogle color="red" />} variant="default" color="gray" {...props} />
  );
}

export type User = { key: string } | null;

export function Login(props: PaperProps) {
  const [user, setUser] = useLoginStore((state) => [state.user, state.setUser]);
  const navigate = useNavigate();
  const [type, toggle] = useToggle(['login', 'register']);
  const [error, setError] = React.useState<string | null>(null);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null)
    }
  });

  useEffect(() => {
    if (user) {
      navigate('/editor');
    }
  }, []);

  const handleFormSubmit = () => {
    if (type === 'login') {
      signInWithEmailAndPassword(form.values.email, form.values.password)
        .then((res) => {
          setUser(res.data);
          navigate('/editor');
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  return (
    <Center sx={{ height: '100vh ' }}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          Login
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton>Google</GoogleButton>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              />
            )}

            <Alert hidden={!error} color="red">
              {error}
            </Alert>

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
            />

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit">{upperFirst(type)}</Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
