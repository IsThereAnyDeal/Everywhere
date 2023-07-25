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
    element.style.top =
      coords.top - (rect.bottom - window.innerHeight) - 20 + "px";
  }
  if (rect.right + 20 > window.innerWidth) {
    element.style.left =
      coords.left - (rect.right - window.innerWidth) - 20 + "px";
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

function appendAfterFirstText(
  parentElement: Node,
  elementToAppend: Node
): boolean {
  const priceOrPercentageRegex = /[%€$£¥]?[\d]+([.,]\d+)?[%€$£¥]?/;

  let treeWalker = document.createTreeWalker(
    parentElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node: Text) => {
        // We accept non-empty text nodes that are not just whitespace
        // and contain either a price or a percentage.
        return node.textContent?.trim() &&
          priceOrPercentageRegex.test(node.textContent)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    }
  );

  let textNode = treeWalker.nextNode();

  if (!textNode) {
    treeWalker = document.createTreeWalker(
      parentElement,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node: Text) => {
          // We accept any non-empty text node
          return node.textContent?.trim()
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      }
    );

    textNode = treeWalker.nextNode();
  }

  if (textNode) {
    if (textNode.nextSibling) {
      textNode.parentNode?.insertBefore(elementToAppend, textNode.nextSibling);
    } else {
      textNode.parentNode?.appendChild(elementToAppend);
    }
  } else {
    // check if the parent node has a image node directly in it
    const hasImage = Array.from(parentElement.childNodes).some(
      (node) => node.nodeName === "IMG"
    );
    // If no suitable text node is found, append to the parent node itself
    // except if there is an image node directly in it
    if (!hasImage) parentElement.appendChild(elementToAppend);
    else return false;
  }

  // Return true, since the element is appended in any case
  return true;
}

export { debounce, keepInViewPort, getCoords, appendAfterFirstText };
