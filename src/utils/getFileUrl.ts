import { getFileAsset } from '@sanity/asset-utils';

export const getFileUrl = (ref: string) => {
    return getFileAsset(ref, {
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    }).url;
};
