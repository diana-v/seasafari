import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { db } from '@/server/db';
import { orders, Status } from '@/server/db/schema';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const credentials = Buffer.from(
            `${process.env.MAKECOMMERCE_SHOP_ID}:${process.env.MAKECOMMERCE_SECRET_KEY}`
        ).toString('base64');

        const headerList = await headers();

        const clientIp =
            headerList.get('x-client-ip') ||
            headerList.get('x-forwarded-for')?.split(',')[0] ||
            headerList.get('x-real-ip') ||
            '127.0.0.1';

        const clientCountry =
            headerList.get('x-client-country') ||
            headerList.get('x-vercel-ip-country') ||
            'lt';

        await db.insert(orders).values({
            orderAmount: Number(body.amount),
            orderEmail: body.email,
            orderRef: body.reference,
            status: Status.UNPAID,
            validFrom: new Date(),
            validTo: new Date(Date.now() + 1000 * 60 * 60 * 6)
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

        const redirectUrl =
            `${process.env.MAKECOMMERCE_GATEWAY_URL}/pay.html?trx=${responseData.id}`;

        const res = new NextResponse(redirectUrl, {
            headers: {
                'content-type': 'text/plain',
            },
        });

        res.cookies.set('paymentRef', body.reference, {
            httpOnly: true,
            maxAge: 60 * 60,
            path: '/',
            sameSite: 'lax',
        });

        return res;
    } catch {
        return new NextResponse('Error setting up payment', { status: 500 });
    }
}
