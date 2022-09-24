import * as functions from "firebase-functions";
import { v2 as cloudinary } from "cloudinary";


export const uploadImage =
  functions.https.onCall(async (data) => {
    try {
      // Set Cloudinary config
      cloudinary.config({
        cloud_name: `${functions.config().cloudinary.cloudname}`,
        api_key: `${functions.config().cloudinary.apikey}`,
        api_secret: `${functions.config().cloudinary.apisecret}`,
      });
      const {dataUrl} = JSON.parse(data);
      const datetime = new Date();
      const timeStamp = datetime.toJSON();

      // Set folder for uploads
      const day = timeStamp.substring(0, 10);
      const promise = await cloudinary.uploader.upload(dataUrl, {
        public_id: `${day}/sample-${timeStamp}`,
        tags: "uploaded-photos", // tag
        background_removal: "cloudinary_ai",
      });
      return JSON.stringify(promise);
    } catch (err) {
      return JSON.stringify(err);
    }
  });
