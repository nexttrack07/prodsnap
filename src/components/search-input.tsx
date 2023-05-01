import { TextInput, TextInputProps, ActionIcon, useMantineTheme } from '@mantine/core';
import { Search, ArrowRight, ArrowLeft } from 'tabler-icons-react';

type Props = TextInputProps & {
  placeholder: string;
};

export function SearchInput({ placeholder, ...props }: Props) {
  const theme = useMantineTheme();

  return (
    <TextInput
      icon={<Search size="1.1rem" />}
      radius="sm"
      size="md"
      rightSection={
        <ActionIcon size={32} radius="sm" color={theme.primaryColor} variant="filled">
          {theme.dir === 'ltr' ? <ArrowRight size="1.1rem" /> : <ArrowLeft size="1.1rem" />}
        </ActionIcon>
      }
      placeholder={placeholder}
      rightSectionWidth={42}
      {...props}
    />
  );
}
