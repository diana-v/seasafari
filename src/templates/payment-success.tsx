import React from 'react';
import { Page, Text, View, Document, Image, Font, StyleSheet, renderToStream } from '@react-pdf/renderer';
import * as path from 'node:path';
import QRCode from 'qrcode';

import { languages, LocaleType } from '@/translations/paymentSuccessPdf';
import { createGiftCardToken } from '@/utils/jwt';

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: path.resolve('public/fonts/Roboto-Regular.ttf'),
            fontWeight: 400,
        },
        {
            src: path.resolve('public/fonts/Roboto-Medium.ttf'),
            fontWeight: 500,
        },
        {
            src: path.resolve('public/fonts/Roboto-Bold.ttf'),
            fontWeight: 700,
        },
        {
            src: path.resolve('public/fonts/Roboto-Black.ttf'),
            fontWeight: 900,
        },
    ],
});

const styles = StyleSheet.create({
    pageContainer: {
        fontFamily: 'Roboto',
        letterSpacing: 0.5,
        paddingTop: 20,
        paddingRight: 50,
        paddingLeft: 50,
        paddingBottom: 60,
        display: 'flex',
        flex: 1,
    },
    pageImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 1123,
        width: 794,
        maxWidth: '100%',
        maxHeight: '100%',
    },
    backgroundImage: {
        objectFit: 'cover',
        height: '100%',
        maxHeight: '100%',
        transform: 'scale(1.3)',
        transformOrigin: 'right bottom',
    },
    logo: {
        width: 172,
        height: 76,
        alignSelf: 'center',
        marginBottom: 20,
    },
    container: {
        backgroundColor: '#ffffff',
        paddingTop: 16,
        paddingBottom: 40,
        paddingRight: 16,
        paddingLeft: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: 900,
        marginBottom: 16,
        textTransform: 'uppercase',
        color: '#15496b',
        textAlign: 'center',
    },
    titleContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        color: '#15496b',
    },
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#15496b',
        marginBottom: 2,
    },
    sectionDescription: {
        fontSize: 10,
        lineHeight: 1.2,
        fontWeight: 400,
        color: '#15496b',
        whiteSpace: 'pre-line',
    },
    details: {
        color: '#15496b',
        fontSize: 10,
        fontWeight: 400,
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 12,
    },
    column: {
        flexDirection: 'column',
        flex: 1,
    },
    footer: {
        paddingTop: 10,
        borderTop: '2px solid #A8352E',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
    },
    qrImage: {
        width: 60,
        height: 60,
        flexShrink: 0,
    },
    infoColumn: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 4,
        flexShrink: 1,
        flex: 1,
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    footerRight: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flex: 1,
        gap: 4,
    },
    textCenter: {
        textAlign: 'center',
    },
    detailsTitle: {
        fontWeight: 'bold',
    },
    bullet: {
        color: '#a8b3bd',
        textAlign: 'right',
        fontSize: 8,
    },
    photo: {
        flex: 1,
        objectFit: 'cover',
    },
    space: {
        marginTop: 8,
        marginBottom: 6,
    },
});

interface PaymentSuccessPDFProps {
    orderRef: string;
    count?: string;
    validFrom: Date;
    validTo: Date;
    locale: string;
    qrDataUrl?: string;
}

const PaymentSuccessPDF: React.FC<PaymentSuccessPDFProps> = ({
    orderRef,
    count,
    validFrom,
    validTo,
    locale,
    qrDataUrl,
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
                            style={styles.backgroundImage}
                            source={path.join(process.cwd(), 'public', 'images', 'background.jpg')}
                        />
                    </View>
                    <Image style={styles.logo} source={path.join(process.cwd(), 'public', 'images', 'logo.png')} />
                    <View style={styles.container}>
                        <Text style={styles.header}>{localisedString.giftCard}</Text>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{localisedString.title}</Text>
                            {count && <Text style={styles.title}>({count})</Text>}
                        </View>

                        <View style={[styles.section, styles.textCenter]}>
                            <Text style={styles.sectionTitle}>{localisedString.about}</Text>
                            <Text style={[styles.sectionDescription, styles.space]}>{localisedString.description}</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Image
                                    style={styles.photo}
                                    source={path.join(process.cwd(), 'public', 'images', 'offer.png')}
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

export const generatePdfDoc = async ({ orderRef, validFrom, validTo, count, locale }: PaymentSuccessPDFProps) => {
    const decodedCount = count ? decodeURIComponent(count) : undefined;
    const token = createGiftCardToken(orderRef, validTo);
    const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/verify-qr?token=${token}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 200 });

    return renderToStream(
        <PaymentSuccessPDF
            orderRef={orderRef}
            count={decodedCount}
            validFrom={validFrom}
            validTo={validTo}
            locale={locale}
            qrDataUrl={qrDataUrl}
        />
    );
};
