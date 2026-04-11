import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const makePayment = async (req: NextRequest) => {
    const body = await req.json();

    try {
        const headerStore = await headers();

        const forwardedFor = headerStore.get('x-forwarded-for');
        const realIp = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
        const clientCountry = headerStore.get('x-vercel-ip-country') || 'LT';

        const credentials = Buffer.from(
            `${process.env.MAKECOMMERCE_SHOP_ID}:${process.env.MAKECOMMERCE_SECRET_KEY}`
        ).toString('base64');

        const cookieStore = await cookies();

        cookieStore.set('paymentRef', body.reference, {
            httpOnly: true,
            maxAge: 3600,
            path: '/',
            sameSite: 'lax',
        });

        const params = `ref=${encodeURIComponent(body.reference)}&email=${encodeURIComponent(
            body.email
        )}&amount=${encodeURIComponent(body.amount)}&locale=${encodeURIComponent(body.locale)}`;

        const response = await fetch(`${process.env.MAKECOMMERCE_API_URL}/v1/transactions`, {
            body: JSON.stringify({
                customer: {
                    country: clientCountry,
                    email: body.email,
                    ip: realIp,
                    locale: body.locale,
                },
                transaction: {
                    amount: body.amount,
                    currency: 'EUR',
                    reference: body.reference,
                    transaction_url: {
                        cancel_url: {
                            method: 'POST',
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/${body.locale}/#gift-cards`,
                        },
                        notification_url: {
                            method: 'POST',
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/payment-success?${params}&x-vercel-protection-bypass=${process.env.VERCEL_AUTOMATION_BYPASS_SECRET}`,
                        },
                        return_url: {
                            method: 'POST',
                            url: `${process.env.NEXT_PUBLIC_DOMAIN}/${body.locale}/pending?ref=${body.reference}`,
                        },
                    },
                },
            }),
            headers: {
                Authorization: `Basic ${credentials}`,
                'content-type': 'application/json',
            },
            method: 'POST',
        });

        const responseData = await response.json();

        if (!responseData.id) {
            // eslint-disable-next-line no-console
            console.error('MakeCommerce Error:', responseData);

            return new NextResponse('Payment Provider Error', { status: 400 });
        }

        return new NextResponse(`${process.env.MAKECOMMERCE_GATEWAY_URL}/pay.html?trx=${responseData.id}`, {
            status: 200,
        });
    } catch {
        return new NextResponse('Error setting up payment', { status: 500 });
    }
};

export { makePayment as POST };
