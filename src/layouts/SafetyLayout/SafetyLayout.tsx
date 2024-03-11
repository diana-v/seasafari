import * as React from 'react';
import { TypedObject } from '@portabletext/types';

import { RichTextComponent } from '@/components/RichText/RichTextComponent';
import { CardComponent, CardType } from '@/components/Card/CardComponent';
import { ModalContainer, ModalType } from '@/containers/Modal/ModalContainer';
import { ImageContainer } from '@/containers/Image/ImageContainer';
import { IconComponent } from '@/components/Icon/IconComponent';

type CardsType = {
    title?: string;
    icon?: string;
    image?: string;
};

export interface SafetyProps {
    sectionTitle?: string;
    title?: string;
    description?: TypedObject | TypedObject[];
    cards?: CardsType[];
    disclaimer?: string;
}

export const SafetyLayout: React.FC<SafetyProps> = ({ sectionTitle, title, description, cards, disclaimer }) => {
    if (!cards?.length) {
        return null;
    }
    const modalRef = React.useRef<React.ElementRef<typeof ModalContainer>>(null);

    const closeModal = React.useCallback(() => modalRef.current?.close(), []);
    const openModal = React.useCallback(() => modalRef.current?.open(), []);

    return (
        <div
            id={sectionTitle?.toLowerCase()}
            className="container mx-auto px-4 my-8 md:my-16 lg:my-24 flex flex-col items-center flex flex-col gap-6 md:gap-10 lg:gap-16"
        >
            {(title || description) && (
                <div className="max-w-5xl text-center">
                    {title && <h1 className="uppercase">{title}</h1>}
                    {description && <RichTextComponent content={description} />}
                </div>
            )}
            <div className="flex flex-wrap flex-col md:flex-row justify-center gap-4 lg:gap-8 w-full">
                {cards?.map((card, index) => (
                    <div key={index} className="flex-grow basis-1 md:basis-1/3 h-full w-full">
                        <CardComponent
                            type={CardType.Icon}
                            title={card.title}
                            icon={card.icon}
                            image={card.image}
                            onClick={openModal}
                        />
                        <ModalContainer ref={modalRef} type={ModalType.centered} onClose={closeModal}>
                            <div>
                                <div className="flex text-grey-900 font-bold items-center justify-end px-5 py-3">
                                    <button onClick={closeModal}>
                                        <IconComponent name="cross" className="h-3.5" />
                                    </button>
                                </div>
                                <div className="border-t px-10 py-5">
                                    <ImageContainer src={card.image} width={942} height={440} />
                                </div>
                            </div>
                        </ModalContainer>
                    </div>
                ))}
            </div>
            <span className="text-red-900 self-start">{disclaimer}</span>
        </div>
    );
};
