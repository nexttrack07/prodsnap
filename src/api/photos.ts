import { firestore, functions } from '@/utils/firebase';
import { client } from './client';
import { httpsCallable } from 'firebase/functions';
import { addDoc, collection } from 'firebase/firestore';

type Photo = {
  id: number;
  src: string;
  source: string;
  url: string;
  thumb: string;
  alt: string;
};

type PhotoResponse = {
  page: number;
  images: Photo[];
};

type Image = {
  id: number;
  user: number;
  image: string;
  public_id?: string;
};

type ImageResponse = {
  results: Image[];
  next: string | null;
  previous: string | null;
  count: number;
};

export async function getPopularPhotos(page = 1) {
  const getPopularPhotosFunc = httpsCallable(functions, 'getPopularImages');
  const res = await getPopularPhotosFunc({ page });

  return res.data as { page: number; images: Photo[]};
}

export async function searchPhotos(query = 'bag', page = 1) {
  return client
    .get<PhotoResponse>('/search-photos?query=' + query + '&page=' + page)
    .then((res) => res.data);
}

export async function uploadPhoto(formData: FormData) {
  return client.post<any>('/upload-image/', formData).then((res) => res.data);
}

export async function getImages() {
  return client.get<ImageResponse>('images').then((res) => res.data);
}

// export async function removeBackground(imageUrl: string) {
//   return client.post<any>("/remove_background/", { image: imageUrl }).then(res => res.data);
// }

// export async function getBackgroundRemovalStatus(id: string) {
//   return client.get<any>("/remove_background/" + id).then(res => res.data);
// }

export const removeBackground = async ({ url }: { url: string }) => {
  const removeBgFunc = httpsCallable(functions, 'removeBackground');

  const res: any = await removeBgFunc({ url });

  const collectionRef = collection(firestore, 'images');
  await addDoc(collectionRef, { filename: res.data.filename, url: res.data.url });

  return res.data;
};
