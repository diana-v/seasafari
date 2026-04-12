import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const credentials = Buffer.from(
            `${process.env.MAKECOMMERCE_SHOP_ID}:${process.env.MAKECOMMERCE_SECRET_KEY}`
        ).toString('base64');

        const { searchParams } = new URL(req.url);
        const clientIp = searchParams.get('clientIp');
        const clientCountry = searchParams.get('clientCountry');

        const response = NextResponse.json(null, { status: 200 });

        response.cookies.set('paymentRef', body.reference, {
            httpOnly: true,
            maxAge: 60 * 60,
            path: '/',
            sameSite: 'lax',
        });

        const apiResponse = await fetch(
            `${process.env.MAKECOMMERCE_API_URL}/v1/transactions`,
            {
                body: JSON.stringify({
                    customer: {
                        country: clientCountry,
                        email: body.email,
                        ip: clientIp,
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
                                url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/payment-success?email=${encodeURIComponent(
                                    body.email
                                )}&x-vercel-protection-bypass=${process.env.VERCEL_AUTOMATION_BYPASS_SECRET}`,
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
            }
        );

        const responseData = await apiResponse.json();

        console.log('MAKECOMMERCE RESPONSE:', responseData);

        return new NextResponse(
            `${process.env.MAKECOMMERCE_GATEWAY_URL}/pay.html?trx=${responseData.id}`,
            {
                headers: {
                    'content-type': 'text/plain',
                },
                status: 200,
            }
        );
    } catch {
        return new NextResponse('Error setting up payment', { status: 500 });
    }
}
