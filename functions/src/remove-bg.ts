import * as functions from "firebase-functions";
import { v2 as cloudinary } from "cloudinary";

// Set Cloudinary config
cloudinary.config({
  cloud_name: `${functions.config().cloudinary.cloudname}`,
  api_key: `${functions.config().cloudinary.apikey}`,
  api_secret: `${functions.config().cloudinary.apisecret}`,
});

export const removeBackground =
  functions.https.onCall(async (data) => {
    try {
      const {dataUrl} = JSON.parse(data);
      const datetime = new Date();
      const timeStamp = datetime.toJSON();

      // Set folder for uploads
      const day = timeStamp.substring(0, 10);
      const promise = await cloudinary.uploader.upload(dataUrl, {
        public_id: `${day}/sample-${timeStamp}`,
        tags: "react-firebase", // tag
      });
      return JSON.stringify(promise);
    } catch (err) {
      return JSON.stringify(err);
    }
  });
