import * as functions from 'firebase-functions';
import { RemoveBgError, removeBackgroundFromImageUrl } from 'remove.bg';
import * as admin from 'firebase-admin';

admin.initializeApp();

function nanoid(): string {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000000);
  const uniqueId = `${timestamp}-${randomNum}`;

  return uniqueId;
}

export const removeBackground = functions.https.onCall(async (data) => {
  try {
    // const formData = new FormData();
    // formData.append('size', 'auto');
    // formData.append('image_url', data.url);

    // const config = {
    //   method: 'post',
    //   url: 'https://api.remove.bg/v1.0/removebg',
    //   data: formData,
    //   responseType: 'arraybuffer' as const,
    //   headers: {
    //     ...formData.getHeaders(),
    //     'X-Api-Key': `${process.env.REMOVE_BG_API_KEY}`,
    //   },
    //   encoding: null,
    // }

    // const response = await axios(config);
    const res = await removeBackgroundFromImageUrl({
      url: data.url,
      apiKey: `${process.env.REMOVE_BG_API_KEY}`,
      size: 'auto'
    });
    const photo = res.base64img;

    const filename = nanoid() + '.jpg';

    const getBase64MimeType = (encoded: string) => {
      let result = null;
      if (typeof encoded !== 'string') {
        return result;
      }
      const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      if (mime && mime.length) {
        result = mime[1];
      }
      return result;
    };

    const getBase64Data = (encoded: string) => {
      const base64EncodedString = encoded.replace(/^data:\w+\/\w+;base64,/, '');
      return base64EncodedString;
    };

    const contentType = getBase64MimeType(photo);

    const photoData = getBase64Data(photo);

    const fileBuffer = Buffer.from(photoData, 'base64');

    const bucket = admin.storage().bucket();

    const token = nanoid();

    const options = {
      metadata: {
        contentType,
        metadata: {
          firebaseStorageDownloadTokens: token
        }
      }
    };

    const filePath = 'images/' + filename;

    const file = bucket.file(filePath);

    await file.save(fileBuffer, options);

    return {
      url: `https://firebasestorage.googleapis.com/v0/b/prodsnap.appspot.com/o/images%2F${filename}?alt=media&token=${token}}`,
      filename
    };
  } catch (errors: unknown) {
    const err = errors as RemoveBgError;
    return { error: err };
  }
});
