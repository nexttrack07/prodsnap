import { client } from './client';


type GraphicResponse = {
  id: number;
  desc: string;
  url: string;
  created_at: string;
  updated_at: string;
  category_id: number;
}

type ResWithPagination<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export async function getGraphics(page: number = 1) {
  return client.get<ResWithPagination<GraphicResponse>>("/graphics/?page=" + page).then(res => res.data);
}

export async function searchGraphics(query: string = 'nature') {
  return client.get<ResWithPagination<GraphicResponse>>("/search/graphics/" + query).then(res => res.data);
}