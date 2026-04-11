import { Document, Font, Image, Page, renderToStream, StyleSheet, Text, View } from '@react-pdf/renderer';
import path from 'node:path';
import QRCode from 'qrcode';
import React from 'react';

import { languages, LocaleType } from '@/translations/paymentSuccessPdf';
import { createGiftCardToken } from '@/utils/jwt';

Font.register({
    family: 'Roboto',
    fonts: [
        {
            fontWeight: 400,
            src: path.resolve('public/fonts/Roboto-Regular.ttf'),
        },
        {
            fontWeight: 500,
            src: path.resolve('public/fonts/Roboto-Medium.ttf'),
        },
        {
            fontWeight: 700,
            src: path.resolve('public/fonts/Roboto-Bold.ttf'),
        },
        {
            fontWeight: 900,
            src: path.resolve('public/fonts/Roboto-Black.ttf'),
        },
    ],
});

const styles = StyleSheet.create({
    backgroundImage: {
        height: '100%',
        maxHeight: '100%',
        objectFit: 'cover',
        transform: 'scale(1.3)',
        transformOrigin: 'right bottom',
    },
    bullet: {
        color: '#a8b3bd',
        fontSize: 8,
        textAlign: 'right',
    },
    column: {
        flex: 1,
        flexDirection: 'column',
    },
    container: {
        backgroundColor: '#ffffff',
        paddingBottom: 40,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
    },
    details: {
        alignItems: 'center',
        color: '#15496b',
        display: 'flex',
        flexDirection: 'row',
        fontSize: 10,
        fontWeight: 400,
        gap: 4,
    },
    detailsTitle: {
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'flex-start',
        borderTop: '2px solid #A8352E',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    footerLeft: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        gap: 12,
    },
    footerRight: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        justifyContent: 'flex-start',
    },
    header: {
        color: '#15496b',
        fontSize: 28,
        fontWeight: 900,
        marginBottom: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    infoColumn: {
        flex: 1,
        flexDirection: 'column',
        flexShrink: 1,
        gap: 4,
        justifyContent: 'flex-start',
    },
    logo: {
        alignSelf: 'center',
        height: 76,
        marginBottom: 20,
        width: 172,
    },
    pageContainer: {
        display: 'flex',
        flex: 1,
        fontFamily: 'Roboto',
        letterSpacing: 0.5,
        paddingBottom: 60,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 20,
    },
    pageImage: {
        height: 1123,
        left: 0,
        maxHeight: '100%',
        maxWidth: '100%',
        position: 'absolute',
        top: 0,
        width: 794,
    },
    photo: {
        flex: 1,
        objectFit: 'cover',
    },
    qrImage: {
        flexShrink: 0,
        height: 60,
        width: 60,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    section: {
        marginBottom: 8,
    },
    sectionDescription: {
        color: '#15496b',
        fontSize: 10,
        fontWeight: 400,
        lineHeight: 1.2,
        whiteSpace: 'pre-line',
    },
    sectionTitle: {
        color: '#15496b',
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 2,
    },
    space: {
        marginBottom: 6,
        marginTop: 8,
    },
    textCenter: {
        textAlign: 'center',
    },
    title: {
        color: '#15496b',
        fontSize: 16,
        textAlign: 'center',
    },
    titleContainer: {
        marginBottom: 16,
    },
});

interface PaymentSuccessPDFProps {
    count?: string;
    locale: string;
    orderRef: string;
    qrDataUrl?: string;
    validFrom: Date;
    validTo: Date;
}

const PaymentSuccessPDF: React.FC<PaymentSuccessPDFProps> = ({
    count,
    locale,
    orderRef,
    qrDataUrl,
    validFrom,
    validTo,
}) => {
    const localisedString = languages[locale as LocaleType];
    const formattedValidFrom = validFrom.toISOString().split('T')[0];
    const formattedValidTo = validTo.toISOString().split('T')[0];

    return (
        <Document>
            <Page size="A4">
                <View style={styles.pageContainer}>
                    <View style={styles.pageImage}>
                        <Image
                            source={path.join(process.cwd(), 'public', 'images', 'background.jpg')}
                            style={styles.backgroundImage}
                        />
                    </View>
                    <Image source={path.join(process.cwd(), 'public', 'images', 'logo.png')} style={styles.logo} />
                    <View style={styles.container}>
                        <Text style={styles.header}>{localisedString.giftCard}</Text>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{localisedString.title}</Text>
                            {count && (
                                <Text style={styles.title}>
                                    ({count} {localisedString.count})
                                </Text>
                            )}
                        </View>

                        <View style={[styles.section, styles.textCenter]}>
                            <Text style={styles.sectionTitle}>{localisedString.about}</Text>
                            <Text style={[styles.sectionDescription, styles.space]}>{localisedString.description}</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Image
                                    source={path.join(process.cwd(), 'public', 'images', 'offer.png')}
                                    style={styles.photo}
                                />
                            </View>
                            <View style={styles.column}>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>{localisedString.intentTitle}</Text>
                                    <Text style={styles.sectionDescription}>{localisedString.intentDescription}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>{localisedString.registrationTitle}</Text>
                                    <Text style={styles.sectionDescription}>
                                        {localisedString.registrationDescription}
                                    </Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>{localisedString.locationTitle}</Text>
                                    <Text style={styles.sectionDescription}>{localisedString.locationDescription}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>{localisedString.durationTitle}</Text>
                                    <Text style={styles.sectionDescription}>{localisedString.durationDescription}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>{localisedString.validityTitle}</Text>
                                    <Text style={styles.sectionDescription}>{localisedString.validityDescription}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{localisedString.otherInfoTitle}</Text>
                                <Text style={styles.sectionDescription}>{localisedString.otherInfoDescription}</Text>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <View style={styles.footerLeft}>
                                {qrDataUrl && <Image src={qrDataUrl} style={styles.qrImage} />}
                                <View style={styles.infoColumn}>
                                    <View style={styles.details}>
                                        <Text style={styles.detailsTitle}>{localisedString.giftCardRef}</Text>
                                        <Text style={{ flex: 1 }}>{orderRef}</Text>
                                    </View>
                                    <View style={styles.details}>
                                        <Text style={styles.detailsTitle}>{localisedString.validFrom}</Text>
                                        <Text style={{ flex: 1 }}>{formattedValidFrom}</Text>
                                    </View>
                                    <View style={styles.details}>
                                        <Text style={styles.detailsTitle}>{localisedString.validTo}</Text>
                                        <Text style={{ flex: 1 }}>{formattedValidTo}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.footerRight}>
                                <Text style={styles.bullet}>- {localisedString.disclaimer1}</Text>
                                <Text style={styles.bullet}>- {localisedString.disclaimer2}</Text>
                                <Text style={styles.bullet}>- {localisedString.disclaimer3}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export const generatePdfDoc = async ({ count, locale, orderRef, validFrom, validTo }: PaymentSuccessPDFProps) => {
    const decodedCount = count ? decodeURIComponent(count) : undefined;
    const token = createGiftCardToken(orderRef, validTo);
    const qrUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/verify-qr?token=${encodeURIComponent(
        token
    )}&locale=${encodeURIComponent(locale)}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 200 });

    return renderToStream(
        <PaymentSuccessPDF
            count={decodedCount}
            locale={locale}
            orderRef={orderRef}
            qrDataUrl={qrDataUrl}
            validFrom={validFrom}
            validTo={validTo}
        />
    );
};
