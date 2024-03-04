export function getScrollbarSize(doc: Document): number {
    const scrollDiv = doc.createElement('div');

    scrollDiv.style.width = '99px';
    scrollDiv.style.height = '99px';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.overflow = 'scroll';

    doc.body.append(scrollDiv);
    const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    scrollDiv.remove();

    return scrollbarSize;
}

export const hasScrollbar = () => window.innerWidth > document.documentElement.clientWidth;
