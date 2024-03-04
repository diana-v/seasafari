import * as React from 'react';
import { PortableText } from '@portabletext/react';
import { TypedObject } from '@portabletext/types';

interface ComponentProps {
    content: TypedObject | TypedObject[];
    classNames?: {
        root?: string;
    };
}

export const RichTextComponent: React.FC<ComponentProps> = ({ content, classNames }) => (
    <div className={classNames?.root}>
        <PortableText value={content} />
    </div>
);

RichTextComponent.displayName = 'RichTextComponent';
