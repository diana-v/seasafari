import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TypedObject } from '@portabletext/types/src';

export type ItemType = {
    label: string;
    slug: string;
    content?: TypedObject | TypedObject[];
};

export interface FooterProps {
    items: ItemType[];
}

export const FooterContainer: React.FC<FooterProps> = ({ items }) => {
    const { locale } = useRouter();

    return (
        <div className="w-full bg-black text-white flex flex-wrap justify-between items-center p-4 gap-4">
            <div className="font-bold">© Copyright {new Date().getFullYear()} SeaSafari</div>
            <div className="flex flex-wrap divide-x gap-y-4">
                {items?.map((item, index) =>
                    item.content ? (
                        <Link
                            key={index}
                            href={{
                                pathname: '/[locale]/c/[contentId]',
                                query: { contentId: item.slug, locale },
                            }}
                            className="px-4 underline underline-offset-4"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <Link key={index} href={item.slug} className="px-4 underline underline-offset-4">
                            {item.label}
                        </Link>
                    )
                )}
            </div>
        </div>
    );
};
