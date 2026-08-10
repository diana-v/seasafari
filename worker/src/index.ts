interface Env {
    MEDIA: R2Bucket;
}

const ALLOWED_ORIGINS = [
    'https://seasafari.lt',
    'https://www.seasafari.lt',
    'http://localhost:3000',
];

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const referer = request.headers.get('Referer') ?? '';

        if (!ALLOWED_ORIGINS.some(origin => referer.startsWith(origin))) {
            return new Response('Forbidden', { status: 403 });
        }

        const key = new URL(request.url).pathname.slice(1);
        const object = await env.MEDIA.get(key);

        if (!object) return new Response('Not found', { status: 404 });

        const headers = new Headers();

        object.writeHttpMetadata(headers);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        return new Response(object.body, { headers });
    },
};