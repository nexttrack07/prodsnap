import { Cloudinary } from "@cloudinary/url-gen";

// Create a Cloudinary instance and set your cloud name.
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUD_NAME as string,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY as string,
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET as string,
  }
});

export default cld;