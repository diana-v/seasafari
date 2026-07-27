import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TYPE_TO_TAGS: Record<string, string[]> = {
    about:          ['about', 'all_home'],
    blog:           ['blog', 'blogs', 'all_home'],
    blogs:          ['blogs', 'all_home'],
    common:         ['navigation', 'common', 'footer', 'contact', 'all_home'],
    contact:        ['contact', 'all_home'],
    faq:            ['faq', 'footer', 'all_home'],
    footer:         ['footer', 'content', 'all_home'],
    gallery:        ['gallery', 'all_home'],
    giftCard:       ['giftCard', 'all_home'],
    giftCardWidget: ['giftCardWidget', 'all_home'],
    home:           ['home', 'all_home'],
    offer:          ['offer',  'offers', 'all_home'],
    offers:         ['offers', 'all_home'],
    partners:       ['partners', 'all_home'],
    reviews:        ['reviews', 'all_home'],
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