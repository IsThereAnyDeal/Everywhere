import DOMPurify from "dompurify";
import itadButton, { ItadButtonProps } from "./itadButton";

const headerButtonProps: ItadButtonProps = {
  url: "https://isthereanydeal.com/",
  text: "IsThereAnyDeal",
};

const itadContainer = () => {
  const container = document.createElement("div");
  container.id = "itad_info_container";
  container.classList.add("itad_info_container_hidden");

  const header = document.createElement("a");
  header.id = "itad_info_container_header";
  header.innerText = headerButtonProps.text;
  if (headerButtonProps.url) header.href = headerButtonProps.url;
  header.target = "_blank";
  header.rel = "noopener";

  const status = document.createElement("div");
  status.id = "itad_info_status";
  status.innerText = "Loading...";

  container.appendChild(header);
  container.appendChild(status);

  return { container: container, status: status };
};

export default itadContainer;
