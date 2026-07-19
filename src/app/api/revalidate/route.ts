import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TYPE_TO_TAGS: Record<string, string[]> = {
    about:          ['about'],
    blog:           ['blog'],
    blogs:          ['blogs'],
    common:         ['navigation', 'common', 'footer'],
    contact:        ['contact'],
    faq:            ['faq', 'footer'],
    footer:         ['footer', 'content'],
    gallery:        ['gallery'],
    giftCard:       ['giftCard'],
    giftCardWidget: ['giftCardWidget'],
    home:           ['home'],
    offers:         ['offers'],
    partners:       ['partners'],
    reviews:        ['reviews'],
};

export async function POST(req: NextRequest) {
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    if (!secret) {
        return NextResponse.json({ message: 'Revalidation secret not configured' }, { status: 500 });
    }

    const signature = req.headers.get(SIGNATURE_HEADER_NAME);

    if (!signature) {
        return NextResponse.json({ message: 'Missing signature' }, { status: 401 });
    }

    const body = await req.text();

    if (!isValidSignature(body, signature, secret)) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const { _type } = JSON.parse(body) as { _type: string };
    const tags = TYPE_TO_TAGS[_type];

    if (!tags) {
        return NextResponse.json({ message: `No tags mapped for type: ${_type}` });
    }

    for (const tag of tags) {
        revalidateTag(tag, 'max');
    }

    return NextResponse.json({ revalidated: tags });
}