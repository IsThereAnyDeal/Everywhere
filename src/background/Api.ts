import browser from "webextension-polyfill";
import {type GameIdLookupResponse, type GameOverviewResponse} from "../common/_types";
import SteamId from "../common/SteamId";
import Config from "../config";

async function gameIdLookup(steamId: SteamId): Promise<null|string> {
   const response = await fetch("https://api.isthereanydeal.com/unstable/id-lookup/game/v1", {
        method: "POST",
        body: JSON.stringify([steamId.toString()])
    });

    if (response.ok) {
        let json = await response.json();
        if (json) {
            json = json as GameIdLookupResponse;
            return json[steamId.toString()] ?? null;
        }
    }
    return null;
}

async function gameOverview(id: string): Promise<GameOverviewResponse|null> {
    const country = ((await browser.storage.local.get("country"))?.country) ?? "US";

    const response = await fetch("https://api.isthereanydeal.com/games/overview/v2?"+(new URLSearchParams({
        key: Config.ITAD.apiKey,
        country
    })), {
        method: "POST",
        body: JSON.stringify([id])
    });

    if (response.ok) {
        let json = await response.json();
        if (json) {
            return json as GameOverviewResponse;
        }
    } else {
        console.error(response);
        throw new Error("Failed to fetch data");
    }
    return null;
}

export default {
    gameOverview,
    gameIdLookup
}
