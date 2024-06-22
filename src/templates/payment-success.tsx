import React from 'react';
import { Page, Text, View, Document, Image, Font, StyleSheet, renderToStream } from '@react-pdf/renderer';

import { languages, LocaleType } from '@/translations/paymentSuccessPdf';

import logo from '@/public/images/logo.svg';
import baltijosJura from '@/public/images/baltijos-jura.png';

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
            fontWeight: 400,
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
            fontWeight: 700,
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Roboto',
        padding: 40,
        backgroundColor: '#f0f0f0',
        fontSize: 10,
        justifyContent: 'center',
    },
    container: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 8,
    },
    innerContainer: {
        padding: 20,
        border: '1px solid #15496b',
        borderRadius: 8,
        position: 'relative',
    },
    headerContainer: {
        backgroundColor: '#f0f0f0', // Gray background area
        padding: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // Adjust as needed
        position: 'relative',
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
        color: '#15496b',
        textAlign: 'center',
    },
    logo: {
        width: 120,
        height: 50,
    },
    title: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    section: {
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        gap: 16,
    },
    column: {
        flexDirection: 'column',
        flex: 1,
        paddingRight: 10,
    },
    footer: {
        marginTop: 20,
        borderTop: '1px solid #15496b',
        paddingTop: 10,
        fontSize: 8,
    },
    textCenter: {
        textAlign: 'center',
    },
    marginBottom: {
        marginBottom: 16,
    },
    bullet: {
        color: '#888',
        marginLeft: 10,
    },
    photo: {
        flex: 1,
        marginTop: 10,
        objectFit: 'cover',
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
            <Page size="A4" style={styles.page}>
                <View style={[styles.headerContainer, styles.marginBottom]}>
                    <Image style={styles.logo} source={logo} />
                </View>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <View>
                            <Text style={styles.header}>{localisedString.giftCard}</Text>
                            <Text style={styles.title}>
                                {localisedString.title} ({count})
                            </Text>
                        </View>

                        <View style={[styles.section, styles.textCenter]}>
                            <Text style={styles.bold}>{localisedString.about}</Text>
                            <Text>{localisedString.description}</Text>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Image
                                    style={styles.photo}
                                    //@ts-ignore-next-line
                                    source={baltijosJura}
                                />
                            </View>
                            <View style={styles.column}>
                                <View style={styles.section}>
                                    <Text style={styles.bold}>{localisedString.intentTitle}</Text>
                                    <Text>{localisedString.intentDescription}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.bold}>{localisedString.registrationTitle}</Text>
                                    <Text>{localisedString.registrationDescription}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.bold}>{localisedString.locationTitle}</Text>
                                    <Text>{localisedString.locationDescription}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.bold}>{localisedString.durationTitle}</Text>
                                    <Text>{localisedString.durationDescription}</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.bold}>{localisedString.validityTitle}</Text>
                                    <Text>{localisedString.validityDescription}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Text style={styles.bold}>{localisedString.otherInfoTitle}</Text>
                                <Text>{localisedString.otherInfoDescription}</Text>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.bold}>
                                        {localisedString.giftCardRef} {orderRef}
                                    </Text>
                                    <Text style={styles.bold}>
                                        {localisedString.validFrom} {validFrom}
                                    </Text>
                                    <Text style={styles.bold}>
                                        {localisedString.validTo} {validTo}
                                    </Text>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.bullet}>• {localisedString.disclaimer1}</Text>
                                    <Text style={styles.bullet}>• {localisedString.disclaimer2}</Text>
                                    <Text style={styles.bullet}>• {localisedString.disclaimer3}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export const generatePdfDoc = async ({ orderRef, validFrom, validTo, count, locale }: PaymentSuccessPDFProps) =>
    renderToStream(
        <PaymentSuccessPDF orderRef={orderRef} count={count} validFrom={validFrom} validTo={validTo} locale={locale} />
    );
