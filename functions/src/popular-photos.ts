import * as functions from 'firebase-functions';
import axios, { AxiosResponse } from 'axios';

interface PexelsImage {
    id: number;
    url: string;
    alt: string;
    src: {
        large: string;
        tiny: string;
    };
}

interface PexelsResponse {
    photos: PexelsImage[];
}

interface ConsolidatedImage {
    id: number;
    src: string;
    source: string;
    url: string;
    thumb: string;
    alt: string;
}

interface ImageRequestData {
    page?: number;
}

export const getPopularImages = functions.https.onCall((data: ImageRequestData, context) => {
    const pexelsUrl = "https://api.pexels.com/v1/popular";
    const pexelsHeaders = {
        "Authorization": process.env.PEXELS_API_KEY
    };
    const pexelsParams = {
        "page": data.page || 1,
        "per_page": 20
    };

    // Making a GET request
    return axios.get<PexelsResponse>(pexelsUrl, { headers: pexelsHeaders, params: pexelsParams })
        .then((res: AxiosResponse<PexelsResponse>) => {
            let consolidatedImages: ConsolidatedImage[] = [];
            for (let image of res.data.photos) {
                consolidatedImages.push({
                    "id": image.id,
                    "src": image.src.large,
                    "source": "Pexels",
                    "url": image.url,
                    "thumb": image.src.tiny,
                    "alt": image.alt
                });
            }

            return {
                "page": pexelsParams.page,
                "images": consolidatedImages
            };
        })
        .catch(error => {
            console.error(error);
            throw new functions.https.HttpsError('unknown', 'An error occurred while fetching popular images');
        });
});
