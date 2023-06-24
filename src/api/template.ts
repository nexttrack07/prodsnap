import { collection, endAt, getDocs, limit, orderBy, query, startAfter, startAt } from 'firebase/firestore';
import { client } from './client';
import { firestore } from '@/utils/firebase';
import { typesense } from '@/utils/typesense';

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

// export async function getGraphics(page: number = 1) {
//   return client.get<ResWithPagination<GraphicResponse>>("/graphics/?page=" + page).then(res => res.data);
// }
type IconType = { category: string; desc: string; url: string; };

export async function getGraphics(n: number) {
  const SIZE = 20;
  let start = (n - 1) * SIZE + 1;
  let end = n * SIZE;
  const q = query(collection(firestore, "icons"), orderBy("desc"), startAt(start), limit(SIZE));
  const querySnapshot = await getDocs(q);

  let icons: IconType[] = [];
  querySnapshot.forEach((doc) => {
    icons.push(doc.data() as IconType);
  });

  // console.log(icons);

  return {
    results: icons,
    count: icons.length,
    next: n + 1,
  };
}

// export async function searchGraphics(query: string = 'nature') {
//   return client.get<ResWithPagination<GraphicResponse>>("/search/graphics/" + query).then(res => res.data);
// }

export async function searchGraphics(query: string = 'nature') {
  const search = {
    q: query,
    query_by: "desc",
  }

  const res = await typesense.collections('icons').documents().search(search);

  console.log(res);
}