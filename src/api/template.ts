import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase";
import { client } from './client';

export async function addTemplate(data: any, collection: "templates" | "selections" = "templates") {
  await setDoc(doc(firestore, collection, data.id), data);
}

export async function getTemplates() {
  const snap = await getDocs(collection(firestore, "templates"));
  let result: { id: string; data: any }[] = []
  snap.forEach((doc) => {
    result.push({ id: doc.id, data: doc.data() });
  })
  return result;
}

export async function getSelections() {
  const snap = await getDocs(collection(firestore, "selections"));
  let result: { id: string; data: any }[] = []
  snap.forEach((doc) => {
    result.push({ id: doc.id, data: doc.data() });
  })
  return result;
}

type GraphicResponse = {
  id: number;
  desc: string;
  url: string;
  created_at: string;
  updated_at: string;
  category_id: number;
}

export async function getGraphics() {
  return client.get<GraphicResponse[]>("/graphics/").then(res => res.data);
}