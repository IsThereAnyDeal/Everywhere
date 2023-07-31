import GameInfo from "src/types/GamePriceOverview";
import itadButton from "./itadButton";

const itadItemInfo = (gameInfo: GameInfo, a: Event, b: string) => {
  let itad_info_output = "";
  const result = gameInfo.data;

  const { type, appId } = (() => {
    const match = b.match(/(app|apps|sub|bundle)-([0-9]+)/);
    // first should be the type, second the id
    if (match && match.length >= 3) {
      return { type: match[1], appId: match[2] };
    } else {
      return { type: null, appId: null };
    }
  })();

  if (!appId) throw new Error("Invalid game id"); // should probably be used in the status instead
  if (!type) throw new Error("Invalid game type"); // should probably be used in the status instead

  const itad_item = result[`${type}/${appId}`];
  if (!itad_item) throw new Error("No data found for the given game id"); // should probably be used in the status instead

  if (itad_item.price) {
    itad_info_output += itadButton({
      url: itad_item.price.url ? itad_item.price.url : "",
      superText: "Best price now:",
      discount: itad_item.price.cut,
      text: itad_item.price.price_formatted,
      subText: itad_item.price.store,
    });
  } else
    itad_info_output +=
      '<span data-itad-handled="1" class="itad_info_elem_btn itad_info_elem_btn--noprice">No current price found</span>';

  if (itad_item.urls.info)
    itad_info_output += itadButton({
      url: itad_item.urls.info,
      text: "Show all deals",
    });

  if (itad_item.lowest) {
    itad_info_output += itadButton({
      url: itad_item.lowest.url,
      superText: "History low:",
      discount: itad_item.lowest.cut,
      text: itad_item.lowest.price_formatted,
      subText:
        itad_item.lowest.store + " " + itad_item.lowest.recorded_formatted,
    });
  }

  const itad_plain = itad_item.urls.info.match(
    /isthereanydeal.com\/game\/(\w+)\/info/
  );

  if (itad_plain?.length === 2) {
    itad_info_output += itadButton({
      url: `https://isthereanydeal.com/#/page:game/wait?plain=${itad_plain[1]}`,
      text: "Wait for better price",
    });
  }

  if (itad_item.urls.history)
    itad_info_output += itadButton({
      url: itad_item.urls.history,
      text: "Price history",
    });

  itad_info_output += itadButton({
    url: `http://steampeek.hu?appid=${appId}#itadext`,
    text: "Browse similar games",
  });

  const itad_info_elem = document.createElement("div");
  itad_info_elem.id = b;
  itad_info_elem.classList.add("itad_info_elem");

  if (itad_info_output !== "") itad_info_elem.innerHTML = itad_info_output;
  else {
    itad_info_elem.classList.add("noinfo");
    itad_info_elem.innerHTML = `<div class="itad_info_elem_info">Currently there is no information for this game.<br/><br/>You can visit our site and browse all deals:
			${itadButton({ url: "https://isthereanydeal.com/", text: "Trending deals" })}`;
  }

  return itad_info_elem;
};

export default itadItemInfo;
