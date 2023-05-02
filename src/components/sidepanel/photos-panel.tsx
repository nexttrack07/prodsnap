import React from 'react';
import {
  Text,
  Space,
  createStyles,
  SimpleGrid,
  Image,
  LoadingOverlay,
  ScrollArea
} from '@mantine/core';
import { useSetAtom } from 'jotai';
import {
  CanvasElementWithPointAtoms,
  ImageType,
  ImageState,
  addElementAtom
} from '../../components/canvas/store';
import { useQuery } from '@tanstack/react-query';
import { getPopularPhotos } from '@/api/photos';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { SearchInput } from '../search-input';

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: 'pointer',
    padding: 8,
    '&:hover': {
      opacity: 0.7,
      transform: 'scale(1.1)',
      transition: 'transform 0.3s'
    }
  }
}));

const data: { id: number; data: ImageType }[] = [
  {
    id: 0,
    data: {
      type: 'image',
      state: ImageState.Normal,
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      border: { id: 'none', stroke: 'black', strokeWidth: 1 },
      url: 'https://media.kohlsimg.com/is/image/kohls/4637183_Navy_Blue?wid=600&hei=600&op_sharpen=1'
    }
  },
  {
    id: 1,
    data: {
      type: 'image',
      state: ImageState.Normal,
      x: 200,
      y: 200,
      width: 300,
      border: { id: 'none', stroke: 'black', strokeWidth: 1 },
      height: 200,
      url: '/winter-hat.png'
    }
  }
];

export function PhotosPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();
  const photosQuery = useQuery({
    queryKey: ['popular-photos'],
    queryFn: getPopularPhotos
  });
  const [search, setSearch] = useInputState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Photos
      </Text>
      <Space h="xl" />
      <SearchInput value={search} onChange={handleSearchInput} placeholder="Search Photos" />
      <Space h="xl" />
      <LoadingOverlay visible={photosQuery.isFetching && !!search} overlayBlur={2} />
      <ScrollArea.Autosize maxHeight={`calc(100vh - 250px)`}>
        <SimpleGrid spacing="xs" cols={2}>
          {photosQuery.data?.map((photo) => (
            <Image
              key={photo.id}
              radius="xs"
              className={classes.shape}
              onClick={() =>
                handleAddElement({
                  type: 'image',
                  state: ImageState.Normal,
                  x: 200,
                  y: 200,
                  width: 300,
                  height: 200,
                  border: { id: 'none', stroke: 'black', strokeWidth: 1 },
                  url: photo.src,
                  alt: photo.alt
                })
              }
              src={photo.thumb}
            />
          ))}
        </SimpleGrid>
      </ScrollArea.Autosize>
    </>
  );
}
