import { uuid } from "@/utils";
import { firestore } from "@/utils/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function uploadImage(filname: string, url: string) {
  await setDoc(doc(firestore, "images", uuid()), { filname, url });
}
