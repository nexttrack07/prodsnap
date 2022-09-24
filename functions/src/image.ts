import * as functions from "firebase-functions";
import { v2 as cloudinary } from "cloudinary";
import * as FormData from "form-data";
import * as fs from "fs";
import axios from "axios";

export const removeBackground = functions.https.onCall(async (data) => {
  try {
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(data.url));

    const config = {
      method: "post",
      url: "https://api.removal.ai/3.0/remove",
      headers: {
        "Rm-Token": `${functions.config().removal_ai.api_key}`,
        ...formData.getHeaders(),
      },
      data: formData,
    };

    const response= await axios(config);
    console.log(response.data);
    return JSON.stringify({ message: "Success!" });
  } catch (err) {
    return JSON.stringify(err);
  }
});

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

      const createImageTag = (publicId: string) => {
        const url = cloudinary.url(publicId, {
          effect: "background_removal",
        });

        return url;
      };

      // Set folder for uploads
      const day = timeStamp.substring(0, 10);
      const publicId = `${day}/sample-${timeStamp}`;
      await cloudinary.uploader.upload(dataUrl, {
        public_id: publicId,
        tags: "uploaded-photos", // tag
      });
      const url = await createImageTag(publicId);
      return JSON.stringify({ secure_url: url });
    } catch (err) {
      return JSON.stringify(err);
    }
  });
