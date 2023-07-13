import { ITAD_API_KEY } from "./config";
import GameInfo from "./types/GamePriceOverview";
import priceButton from "./html/priceButton";
import infoButton from "./html/infoButton";
let itad_request_timer: NodeJS.Timeout;
let itad_display_timer: NodeJS.Timeout;
const itad_included = true;
let itad_info_container: HTMLDivElement;
let itad_info_status: HTMLDivElement;
let itad_info_container_header = null;

function handleLinks() {
  if (location.href.indexOf("isthereanydeal.com") === -1) {
    const external_links: NodeListOf<HTMLAnchorElement> =
      document.querySelectorAll(
        'a[href*="//store.steampowered.com/"]:not([data-itad-handled="1"])'
      );
    for (let i = 0; i < external_links.length; i++) {
      const appIDs = external_links[i].href.match(
        /\/\/store.steampowered.com\/(app|apps|sub|bundle)\/([0-9]+)/
      );

      if (appIDs === null || appIDs === undefined) return;

      if (appIDs && appIDs.length === 3) {
        const elementToAppend = document.createElement("span");
        elementToAppend.dataset.itadId = appIDs[1] + "/" + appIDs[2];
        elementToAppend.classList.add("itad_everywhere");
        elementToAppend.textContent = "E";
        appendAfterFirstText(external_links[i], elementToAppend);

        elementToAppend.addEventListener("mouseenter", OnEnterExtraElem, {
          passive: true,
        });
        elementToAppend.addEventListener("mouseleave", OnLeaveExtraElem, {
          passive: true,
        });

        external_links[i].dataset.itadHandled = "1";
      }
    }
  }

  if (itad_included && itad_info_container === undefined) {
    itad_info_container = document.createElement("div");
    itad_info_container.id = "itad_info_container";
    // hide by default (#6)
    itad_info_container.classList.add("itad_info_container_hidden");
    itad_info_container.style.top = "-500px";
    itad_info_container.style.left = "-500px";

    itad_info_container_header = document.createElement("div");
    itad_info_container_header.innerHTML =
      "<a id='itad_info_container_header' target='_blank' rel='noopener' href='https://isthereanydeal.com/'>IsThereAnyDeal</a>";
    itad_info_container.appendChild(itad_info_container_header);
    itad_info_status = document.createElement("div");
    itad_info_status.id = "itad_info_status";
    itad_info_status.innerHTML = "Loading...";
    itad_info_container.appendChild(itad_info_status);
    document.body.appendChild(itad_info_container);

    itad_info_container.addEventListener("mouseenter", OnEnterContainer, {
      passive: true,
    });
    itad_info_container.addEventListener("mouseleave", OnLeaveContainer, {
      passive: true,
    });
  }
}

function appendAfterFirstText(
  parentElement: HTMLAnchorElement,
  elementToAppend: HTMLSpanElement
) {
  for (const childElement of parentElement.childNodes) {
    if (childElement === null || childElement.textContent === null) continue;
    if (
      (childElement.nodeType === Node.TEXT_NODE &&
        childElement.textContent?.trim().length > 0) ||
      childElement.nodeName === "I"
    ) {
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
function getItemInfo(e: Event, currentInfoElemId: string) {
  clearTimeout(itad_request_timer);
  itad_request_timer = setTimeout(async function () {
    const target = e.target as HTMLSpanElement;

    if (!target.dataset.itadId) return;

    const feedURL =
      "https://api.isthereanydeal.com/v01/game/overview/?key=" +
      ITAD_API_KEY +
      "&shop=steam&ids=" +
      encodeURIComponent(target.dataset.itadId);
    try {
      const response = await fetch(feedURL);
      if (response.ok) {
        const result = (await response.json()) as GameInfo;
        buildItemInfo(result, e, currentInfoElemId);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, 350);
}

async function buildItemInfo(gameInfo: GameInfo, a: Event, b: string) {
  let itad_info_output = "";
  const result = gameInfo.data;
  const appId = b.match(/app-([0-9]+)/)?.[1];

  if (!appId) throw new Error("Invalid game id");

  const itad_item = result[`app/${appId}`];

  if (!itad_item) throw new Error("No data found for the given game id");

  let itad_plain = "";

  const steamappid = b.match(/app-([0-9]+)/);

  if (itad_item.urls.info) itad_plain = itad_item.urls.info;

  if (itad_item.price) {
    var price_cut_output = "";
    if (itad_item.price.cut !== 0)
      price_cut_output =
        '<div class="itad_info_elem_cut">-' + itad_item.price.cut + "%</div>";

    itad_info_output += priceButton(
      itad_item.price.url ? itad_item.price.url : "",
      "Best price now:",
      price_cut_output + itad_item.price.price_formatted,
      itad_item.price.store
    );
  } else
    itad_info_output +=
      '<span data-itad-handled="1" class="itad_info_elem_btn itad_info_elem_btn--noprice">No current price found</span>';

  if (itad_item.urls.info)
    itad_info_output += infoButton(itad_item.urls.info, "Show all deals");

  if (itad_item.lowest) {
    var price_cut_output = "";
    if (itad_item.lowest.cut !== 0)
      price_cut_output = `<div class="itad_info_elem_cut">-${itad_item.lowest.cut}%</div>`;

    let lowest_url = "";
    if (itad_item.lowest.url) lowest_url = `href= ${itad_item.lowest.url}"`;

    itad_info_output += priceButton(
      lowest_url,
      "History low:",
      price_cut_output + " " + itad_item.lowest.price_formatted,
      itad_item.lowest.store + " " + itad_item.lowest.recorded_formatted
    );
  }

  if (itad_plain.length === 2)
    itad_info_output += infoButton(
      `https://isthereanydeal.com/#/page:game/wait?plain=${itad_plain[1]}`,
      "Wait for better price"
    );

  if (itad_item.urls.history)
    itad_info_output += infoButton(itad_item.urls.history, "Price history");

  if (steamappid && steamappid.length === 2)
    itad_info_output += infoButton(
      `http://steampeek.hu?appid=${steamappid[1]}#itadext`,
      "Browse similar games"
    );

  const itad_info_elem = document.createElement("div");
  itad_info_elem.id = b;
  itad_info_elem.classList.add("itad_info_elem");

  if (itad_info_output !== "") itad_info_elem.innerHTML = itad_info_output;
  else {
    itad_info_elem.classList.add("noinfo");
    itad_info_elem.innerHTML = `<div class="itad_info_elem_info">Currently there is no information for this game.<br/><br/>You can visit our site and browse all deals:
			${infoButton("https://isthereanydeal.com/", "Trending deals")}`;
  }

  if (!document.getElementById(b))
    document
      ?.getElementById("itad_info_container")
      ?.appendChild(itad_info_elem);

  keepInViewPort(itad_info_container);
  itad_info_status.innerHTML = "";
}

function OnEnterExtraElem(e: Event) {
  const target = e.target as HTMLElement;
  const itadId = target.dataset.itadId;
  const { left, top, right, bottom } = target.getBoundingClientRect();
  const popupOffset = 8; // moves the popup under the cursor
  itad_info_container.style.left =
    getCoords(target).left + (right - left) - popupOffset + "px";
  itad_info_container.style.top =
    getCoords(target).top + (bottom - top) - popupOffset + "px";

  clearTimeout(itad_display_timer);
  itad_info_container.classList.remove("itad_info_container_hidden");

  if (!itadId) return;

  const currentInfoElemId = "itad_info_elem_" + itadId.replace("/", "-");

  const divsToHide = document.getElementsByClassName(
    "itad_info_elem"
  ) as HTMLCollectionOf<HTMLElement>;
  for (const div of divsToHide) {
    if (div.id !== currentInfoElemId) {
      div.style.display = "none";
    }
  }

  const currentInfoElem = document.getElementById(currentInfoElemId);

  if (currentInfoElem) {
    itad_info_status.innerHTML = "";
    currentInfoElem.style.display = "flex";
  } else {
    itad_info_status.innerHTML = "Loading...";
    getItemInfo(e, currentInfoElemId);
  }

  keepInViewPort(itad_info_container);
}

function OnLeaveExtraElem(e: Event) {
  if (itad_info_container.classList.contains("itad_info_container_hidden"))
    clearTimeout(itad_request_timer);
  itad_display_timer = setTimeout(function () {
    itad_info_container.classList.add("itad_info_container_hidden");
  }, 200);
}

function OnEnterContainer() {
  clearTimeout(itad_display_timer);
  itad_info_container.classList.remove("itad_info_container_hidden");
}

function OnLeaveContainer() {
  itad_display_timer = setTimeout(function () {
    itad_info_container.classList.add("itad_info_container_hidden");
  }, 200);
}

function keepInViewPort(elem: EventTarget) {
  const element = elem as HTMLDivElement;
  const rect = element.getBoundingClientRect();

  if (rect.bottom + 20 > window.innerHeight) {
    element.style.top =
      getCoords(element).top - (rect.bottom - window.innerHeight) - 20 + "px";
  }
  if (rect.right + 20 > window.innerWidth) {
    element.style.left =
      getCoords(element).left - (rect.right - window.innerWidth) - 20 + "px";
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

const debouncedHandleLinks = debounce(handleLinks, 500);

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      debouncedHandleLinks();
    }
  }
});

observer.observe(document, { childList: true, subtree: true });
handleLinks();
