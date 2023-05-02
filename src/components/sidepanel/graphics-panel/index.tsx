import { uuid } from '@/utils';
import {
  Button,
  Image,
  LoadingOverlay,
  ScrollArea,
  SimpleGrid,
  Space,
  Text,
  createStyles
} from '@mantine/core';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react';
import { getGraphics, searchGraphics } from '@/api/template';
import { useSetAtom } from 'jotai';
import { CanvasElementWithPointAtoms, addElementAtom } from '@/components/canvas/store';
import { SearchInput } from '@/components/search-input';
import { useDebouncedValue, useInputState } from '@mantine/hooks';
import { useStore } from '@/stores';

const useStyles = createStyles(() => ({
  shape: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
      transform: 'scale(1.1)',
      transition: 'transform 0.3s'
    }
  }
}));

export function GraphicsPanel() {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['graphics'],
      queryFn: (page) => getGraphics(page.pageParam || 1),
      getNextPageParam: (lastPage) =>
        lastPage.next ? Number(lastPage.next.split('=')[1]) : undefined,
      keepPreviousData: true
    });
  const addElement = useSetAtom(addElementAtom);
  // const search = useStore((state) => state.value);
  // const setSearch = useStore((state) => state.updateValue);
  const [search, setSearch] = useInputState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const searchQuery = useQuery({
    queryKey: ['graphics/search', debouncedSearch],
    queryFn: () => searchGraphics(debouncedSearch),
    enabled: debouncedSearch.length > 0
  });
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 150px)' }}>
      <Text size="md">Graphics</Text>
      <br />
      <SearchInput value={search} onChange={handleSearchInput} placeholder="Search Graphics" />
      <br />
      <LoadingOverlay
        visible={status === 'loading' || (searchQuery.isFetching && !!search)}
        overlayBlur={2}
      />
      <ScrollArea.Autosize maxHeight={`calc(100vh - 250px)`}>
        {search.length > 0 ? (
          <SimpleGrid cols={5} spacing="md">
            {searchQuery.data?.results.map((graphic, i) => (
              <React.Fragment key={i}>
                <Image
                  onClick={() => {
                    handleAddElement({
                      type: 'svg-graphic',
                      url: graphic.url,
                      alt: graphic.desc,
                      x: 100,
                      y: 200,
                      width: 100,
                      height: 200
                    });
                  }}
                  className={classes.shape}
                  height={50}
                  src={graphic.url}
                  key={uuid()}
                  alt={graphic.desc}
                />
              </React.Fragment>
            ))}
          </SimpleGrid>
        ) : (
          <>
            <SimpleGrid cols={5} spacing="md">
              {data?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.results.map((graphic) => (
                    <Image
                      onClick={() => {
                        handleAddElement({
                          type: 'svg-graphic',
                          url: graphic.url,
                          alt: graphic.desc,
                          x: 100,
                          y: 200,
                          width: 100,
                          height: 200
                        });
                      }}
                      className={classes.shape}
                      height={50}
                      src={graphic.url}
                      key={uuid()}
                      alt={graphic.desc}
                    />
                  ))}
                </React.Fragment>
              ))}
            </SimpleGrid>
            <Space h="xl" />
            <Button
              fullWidth
              loading={isFetchingNextPage}
              onClick={() => {
                fetchNextPage();
              }}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Load More
            </Button>
          </>
        )}
      </ScrollArea.Autosize>
    </div>
  );
}
