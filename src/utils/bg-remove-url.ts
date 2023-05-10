import cld from "./cld";
import { backgroundRemoval, dropShadow } from "@cloudinary/url-gen/actions/effect";

export function getBackgroundRemovedShadowUrl(publicID: string) {

  const myImage = cld.image(publicID); 

  // Apply the background removal and drop shadow effects,
  // then scale the image to the specified dimensions
  // and optimize format and quality
  myImage
  .effect(backgroundRemoval())
  // .effect(dropShadow())
  .format('auto')
  .quality('auto');

  // Return the URL of the image
  return myImage.toURL();
}