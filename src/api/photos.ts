import { client } from './client';

// {
//   "id": 36717,
//   "src": "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&h=650&w=940",
//   "source": "Pexels",
//   "url": "https://www.pexels.com/photo/silhouette-of-tree-near-body-of-water-during-golden-hour-36717/",
//   "thumb": "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
//   "alt": "Silhouette of Tree Near Body of Water during Golden Hour"
// },

type Photo = {
  id: number;
  src: string;
  source: string;
  url: string;
  thumb: string;
  alt: string;
}

type PhotoResponse = {
  page: number;
  images: Photo[];
}

type Image = {
  id: number;
  user: number;
  image: string;
  public_id?: string;
}

type ImageResponse = {
  results: Image[];
  next: string | null;
  previous: string | null;
  count: number;
}

export async function getPopularPhotos(page = 1) {
  return client.get<PhotoResponse>("/popular-photos?page=" + page).then(res => res.data);
}

export async function searchPhotos(query = 'bag', page = 1) {
  return client.get<PhotoResponse>("/search-photos?query=" + query + "&page=" + page).then(res => res.data);
}

export async function uploadPhoto(formData: FormData) {
  return client.post<any>("/upload-image/", formData).then(res => res.data);
}

export async function getImages() {
  return client.get<ImageResponse>("images").then(res => res.data);
}

export async function removeBackground(imageUrl: string) {
  return client.post<any>("/remove_background/", { image: imageUrl }).then(res => res.data);
}

export async function getBackgroundRemovalStatus(id: string) {
  return client.get<any>("/remove_background/" + id).then(res => res.data);
}