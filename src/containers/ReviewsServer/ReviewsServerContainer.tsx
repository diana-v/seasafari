import { OAuth2Client } from 'google-auth-library';

import { ReviewsLayout } from '@/layouts/ReviewsLayout/ReviewsLayout';

interface Props {
    title?: string;
}

export default async function ReviewsServer({ title }: Props) {
    let reviewsData = null;

    try {
        const auth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

        auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        const { token } = await auth.getAccessToken();

        const response = await fetch(
            `https://mybusiness.googleapis.com/v4/accounts/${process.env.GOOGLE_BUSINESS_ID}/locations/${process.env.GOOGLE_LOCATION_ID}/reviews`,
            {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 86_400 }
            }
        );

        if (response.ok) {
            reviewsData = await response.json();
        }
    } catch (error) {
        console.error('Google Reviews Fetch Failed:', error);

        return null;
    }

    return <ReviewsLayout reviewsData={reviewsData} title={title} />;
}