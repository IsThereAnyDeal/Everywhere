const priceButton = (
  url: string,
  top: string,
  middle: string,
  bottom: string
) => {
  return `
				<a target="_blank" rel="noopener" href="${url}" data-itad-handled="1" class="itad_info_elem_price">
          ${top}
					<div class="itad_info_elem_highlighted">
						${middle}
					</div>
					at ${bottom}
				</a>`;
};

export default priceButton;
