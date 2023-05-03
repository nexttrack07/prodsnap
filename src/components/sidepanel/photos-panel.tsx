import React from 'react';
import {
  Text,
  Space,
  createStyles,
  SimpleGrid,
  Image,
  LoadingOverlay,
  ScrollArea,
  Button
} from '@mantine/core';
import { useSetAtom } from 'jotai';
import {
  CanvasElementWithPointAtoms,
  ImageType,
  ImageState,
  addElementAtom
} from '../../components/canvas/store';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getPopularPhotos, searchPhotos } from '@/api/photos';
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

export function PhotosPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();
  const photosQuery = useInfiniteQuery({
    queryKey: ['popular-photos'],
    queryFn: (page) => getPopularPhotos(page.pageParam || 1),
    getNextPageParam: (res) => +res.page + 1,
    keepPreviousData: true
  });
  const [search, setSearch] = useInputState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const searchQuery = useInfiniteQuery({
    queryKey: ['photos/search', debouncedSearch],
    queryFn: () => searchPhotos(debouncedSearch),
    enabled: !!debouncedSearch,
    getNextPageParam: (res) => +res.page + 1,
    keepPreviousData: true
  });

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
      <LoadingOverlay
        visible={(photosQuery.isFetching || searchQuery.isFetching) && !!search}
        overlayBlur={2}
      />
      <ScrollArea.Autosize maxHeight={`calc(100vh - 270px)`}>
        {search.length > 0 ? (
          <>
            <SimpleGrid spacing="xs" cols={2}>
              {searchQuery.data?.pages.map((group) =>
                group.images.map((photo) => (
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
                ))
              )}
            </SimpleGrid>
            <Space h="xl" />
            <Button
              fullWidth
              loading={searchQuery.isFetchingNextPage}
              onClick={() => {
                searchQuery.fetchNextPage();
              }}
              disabled={!searchQuery.hasNextPage || searchQuery.isFetchingNextPage}
            >
              Load More
            </Button>
          </>
        ) : (
          <>
            <SimpleGrid spacing="xs" cols={2}>
              {photosQuery.data?.pages.map((group) =>
                group.images.map((photo) => (
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
                ))
              )}
            </SimpleGrid>
            <Space h="xl" />
            <Button
              fullWidth
              loading={photosQuery.isFetchingNextPage}
              onClick={() => {
                photosQuery.fetchNextPage();
              }}
              disabled={!photosQuery.hasNextPage || photosQuery.isFetchingNextPage}
            >
              Load More
            </Button>
          </>
        )}
      </ScrollArea.Autosize>
    </>
  );
}
