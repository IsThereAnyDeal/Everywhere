import DOMPurify from "dompurify";

interface BaseButtonProps {
  url?: string;
  text: string;
}

interface PriceButtonProps extends BaseButtonProps {
  superText?: string;
  discount?: number;
  subText?: string;
}

type ItadButtonProps = BaseButtonProps | PriceButtonProps;

const itadButton = (props: ItadButtonProps) => {
    const { url, text, superText, discount, subText } = props as PriceButtonProps;

    const sanitizedUrl = url ? "href=" + DOMPurify.sanitize(url) : "";
    const sanitizedText = DOMPurify.sanitize(text);
    const sanitizedSuperText = superText ? DOMPurify.sanitize(superText) : "";
    const sanitizedSubText = subText ? DOMPurify.sanitize(subText) : "";

    const discountText = discount
        ? `<div class="itad_info_elem_cut">-${discount}%</div>`
        : "";
    const mainText = discount
        ? `<span class="itad_info_elem_cut">${discountText}</span><span>${sanitizedText}</span>`
        : `<span>${sanitizedText}</span>`;

    // Check if it's a price button (we can tell by the presence of the PriceButtonProps)
    if (
        superText !== undefined ||
    discount !== undefined ||
    subText !== undefined
    ) {
        return `
      <a target="_blank" rel="noopener" ${sanitizedUrl} data-itad-handled="1" class="itad_info_elem_price">
        ${sanitizedSuperText}
        <div class="itad_info_elem_highlighted">
        ${mainText}
        </div>
        ${sanitizedSubText ? `at ${sanitizedSubText}` : ""}
      </a>
    `;
    } else {
        return `
      <a target="_blank" rel="noopener" ${sanitizedUrl} class="itad_info_elem_btn">${sanitizedText}</a>
    `;
    }
};

export default itadButton;
export type { ItadButtonProps };
