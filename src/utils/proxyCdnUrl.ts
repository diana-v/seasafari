export function proxyCdnUrl(url?: string): string | undefined {
    if (!url) return undefined;

    return url.replace('https://cdn.sanity.io', '/cdn');
}