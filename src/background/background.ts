import browser, {Runtime} from "webextension-polyfill";
import SteamId from "../common/SteamId";
import Api from "./Api";
import MessageSender = Runtime.MessageSender;

interface GameIdLookupMessage {
    api: "gameIdLookup",
    steamId: string
}

interface GameOverviewMessage {
    api: "gameOverview",
    id: string
}

type Message = GameIdLookupMessage|GameOverviewMessage

browser.runtime.onMessage.addListener(function(
    message: Message,
    sender: MessageSender,
    sendResponse: (...params: any) => void
): true {

    if (message.api) {
        (async function() {
            switch(message.api) {
                case "gameIdLookup": sendResponse(await Api.gameIdLookup(new SteamId(message.steamId))); break;
                case "gameOverview": sendResponse(await Api.gameOverview(message.id)); break
            }
        })();
    }

    return true; // because chrome sucks
});
