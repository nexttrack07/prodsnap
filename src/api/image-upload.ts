import { httpsCallable } from "firebase/functions";
import { functions } from "../utils/firebase";

const upload = httpsCallable(functions, 'uploadImage');

export const uploadImage = async (dataUrl: string) => {
  const data = { dataUrl };

  return upload(JSON.stringify(data))
    .then(response => {
      console.log('image data: ', response.data)
      if (response.data && typeof response.data === "string") {
        const data = JSON.parse(response.data)

        // Return the cloudinary image url
        return data.secure_url ?? "";
      }

      return "";
    })
    .catch(error => {
      return error
    })
}
