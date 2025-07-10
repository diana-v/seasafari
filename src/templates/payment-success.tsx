import React from 'react';
import { Page, Text, View, Document, Image, Font, StyleSheet, renderToStream } from '@react-pdf/renderer';
import * as path from 'node:path';

import { languages, LocaleType } from '@/translations/paymentSuccessPdf';

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
    footerColumn: {
        flexDirection: 'column',
        flex: 1,
        gap: 8,
    },
    footer: {
        paddingTop: 10,
        borderTop: '2px solid #A8352E',
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
    count: string;
    validFrom: string;
    validTo: string;
    locale: string;
}

const PaymentSuccessPDF: React.FC<PaymentSuccessPDFProps> = ({ orderRef, count, validFrom, validTo, locale }) => {
    const localisedString = languages[locale as LocaleType];

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
                            <Text style={styles.title}>
                                ({count} {localisedString.intentCount})
                            </Text>
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

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={styles.row}>
                                <View style={styles.footerColumn}>
                                    <View style={styles.details}>
                                        <Text style={styles.detailsTitle}>{localisedString.giftCardRef}</Text>
                                        <Text>{orderRef}</Text>
                                    </View>

                                    <View style={styles.details}>
                                        <Text style={styles.detailsTitle}>{localisedString.validFrom}</Text>
                                        <Text>{validFrom}</Text>
                                    </View>
                                    <View style={styles.details}>
                                        <Text style={styles.detailsTitle}>{localisedString.validTo}</Text>
                                        <Text>{validTo}</Text>
                                    </View>
                                </View>
                                <View style={styles.footerColumn}>
                                    <Text style={styles.bullet}>- {localisedString.disclaimer1}</Text>
                                    <Text style={styles.bullet}>- {localisedString.disclaimer2}</Text>
                                    <Text style={styles.bullet}>- {localisedString.disclaimer3}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export const generatePdfDoc = async ({ orderRef, validFrom, validTo, count, locale }: PaymentSuccessPDFProps) => {
    const decodedCount = decodeURIComponent(count);

    return renderToStream(
        <PaymentSuccessPDF
            orderRef={orderRef}
            count={decodedCount}
            validFrom={validFrom}
            validTo={validTo}
            locale={locale}
        />
    );
};
