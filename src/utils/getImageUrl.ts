import { getImageAsset } from '@sanity/asset-utils';

export const getImageUrl = (source: string) => {
    return getImageAsset(source, {
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? '',
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    }).url;
};
