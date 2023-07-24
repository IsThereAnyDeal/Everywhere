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
  parentElement: HTMLAnchorElement,
  elementToAppend: HTMLSpanElement
) {
  for (const childElement of parentElement.childNodes) {
    if (childElement === null || childElement.textContent === null) continue;

    const isNonEmptyTextNode =
      childElement.nodeType === Node.TEXT_NODE &&
      childElement.textContent?.trim().length > 0;
    const isINode = childElement.nodeName === "I";

    if (isNonEmptyTextNode || isINode) {
      parentElement.insertBefore(elementToAppend, childElement.nextSibling);
      return true;
    }

    if (
      appendAfterFirstText(childElement as HTMLAnchorElement, elementToAppend)
    )
      return true;
  }
  return false;
}

export { debounce, keepInViewPort, getCoords, appendAfterFirstText };
