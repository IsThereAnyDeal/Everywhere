const infoButton = (url: string, text: string) => {
  return `
    <a target="_blank" rel="noopener" href="${url}" class="itad_info_elem_btn">${text}</a>`;
};

export default infoButton;
