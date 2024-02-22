
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

function getAppendableNode(parentElement: HTMLElement): Element|null {
    parentElement.normalize(); // ensures there are no two sibling text nodes

    const priceOrPercentageRegex = /[%€$£¥]?[\d]+([.,]\d+)?[%€$£¥]?/;

    /*
     * Find first non-empty text node that is not just whitespace
     * and contains either a price or percentage
     */
    let treeWalker = document.createTreeWalker(
        parentElement, NodeFilter.SHOW_TEXT, {
            acceptNode: (node: Text) => {
                return node.textContent?.trim()
                && priceOrPercentageRegex.test(node.textContent)
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

    /*
     * Find first non-empty text node
     */
    treeWalker = document.createTreeWalker(
        parentElement, NodeFilter.SHOW_TEXT, {
            acceptNode: (node: Text) => {
                return node.textContent?.trim()
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            },
        }
    );

    textNode = treeWalker.nextNode();

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
