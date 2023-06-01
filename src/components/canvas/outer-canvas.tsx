import { Box } from '@mantine/core';

export function OuterCanvas() {
  return (
    <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Box
        sx={{
          height: 50,
          width: 200,
          backgroundColor: 'red',
          top: 400,
          left: 400,
          position: 'absolute'
        }}
      />
    </Box>
  );
}
