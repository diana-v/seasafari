import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';

export function createGiftCardToken(orderRef: string, validTo: Date) {
    const expiresInSeconds = Math.floor((validTo.getTime() - Date.now()) / 1000);

    return jwt.sign({ orderRef }, JWT_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyGiftCardToken(token: string): { expired?: boolean; orderRef: string } {
    try {
        return jwt.verify(token, JWT_SECRET) as { orderRef: string };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            const payload = jwt.decode(token) as { orderRef: string } | null;

            if (payload?.orderRef) {
                return { expired: true, orderRef: payload.orderRef };
            }
        }
        throw error;
    }
}
