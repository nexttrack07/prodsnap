import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase";

export async function addTemplate(data: any) {
  await setDoc(doc(firestore, "templates", data.id), data);
}

export async function getTemplates() {
  const snap = await getDocs(collection(firestore, "templates"));
  let result: { id: string; data: any }[] = []
  snap.forEach((doc) => {
    result.push({ id: doc.id, data: doc.data() });
  })
  return result;
}
