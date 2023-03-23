import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase";

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
