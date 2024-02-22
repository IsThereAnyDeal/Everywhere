
function debounce(func: () => void, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;

    return function executedFunction() {
        const later = () => {
            clearTimeout(timeout);
            func();
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function keepInViewPort(elem: EventTarget) {
    const element = elem as HTMLDivElement;
    const rect = element.getBoundingClientRect();
    const coords = getCoords(element);

    if (rect.bottom + 20 > window.innerHeight) {
        element.style.top = coords.top - (rect.bottom - window.innerHeight) - 20 + "px";
    }
    if (rect.right + 20 > window.innerWidth) {
        element.style.left = coords.left - (rect.right - window.innerWidth) - 20 + "px";
    }
}

function getCoords(elem: EventTarget) {
    const element = elem as HTMLDivElement;
    const rect = element.getBoundingClientRect();

    return {
        top: rect.top + scrollY,
        left: rect.left + scrollX,
    };
}

function findNodeWithRegex(root: Element, regex: RegExp): Element|null {

    let treeWalker = document.createTreeWalker(
        root, NodeFilter.SHOW_TEXT, {
            acceptNode: (node: Text) => {
                return node.textContent?.trim()
                && regex.test(node.textContent)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            },
        }
    );

    let textNode = treeWalker.nextNode();
    if (textNode) {
        // TODO i dont like this type conversion here
        return (textNode as unknown) as Element;
    }
    return null;
}

function getAppendableNode(parentElement: HTMLElement): Element|null {
    parentElement.normalize(); // ensures there are no two sibling text nodes

    /*
     * Find first non-empty text node that is not just whitespace
     * and contains a price
     */
    let priceNode = findNodeWithRegex(parentElement, /[€$£¥]\s*\d+([.,]\d+)?|\d+([.,]\d+)?\s*[€$£¥]|Free/i);
    if (priceNode) {
        return priceNode;
    }

    let cutNode = findNodeWithRegex(parentElement, /\d+\s*%/);
    if (cutNode) {
        return cutNode;
    }

    /*
     * Find first non-empty text node
     */
    let treeWalker = document.createTreeWalker(
        parentElement, NodeFilter.SHOW_TEXT, {
            acceptNode: (node: Text) => {
                return node.textContent?.trim()
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            },
        }
    );

    let textNode = treeWalker.nextNode();

    if (textNode) {
        // TODO i dont like this type conversion here
        return (textNode as unknown) as Element;
    } else {
        // check if the parent node has an image node directly in it
        const hasImage = Array.from(parentElement.childNodes).some(
            (node) => node.nodeName === "IMG"
        );

        /*
         * If no suitable text node is found, append to the parent node itself
         * except if there is an image node directly in it
         */
        if (!hasImage) {
            return null;
        }
    }

    throw new Error();
}

export { debounce, keepInViewPort, getCoords, getAppendableNode };
