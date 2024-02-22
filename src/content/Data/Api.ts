import Config from "../../config";
import {type GameIdLookupResponse, type GameOverviewResponse} from "./_types";
import SteamId from "./SteamId";

// TODO implement better caching
const idCache: Map<SteamId, string> = new Map();
const cache: Map<string, GameOverviewResponse> = new Map();

async function gameIdLookup(steamId: SteamId): Promise<null|string> {
    if (!idCache.has(steamId)) {
        const response = await fetch("https://api.isthereanydeal.com/unstable/id-lookup/game/v1", {
            method: "POST",
            body: JSON.stringify([steamId.toString()])
        });

        let id = null;
        if (response.ok) {
            let json = await response.json();
            if (json) {
                json = json as GameIdLookupResponse;
                id = json[steamId.toString()] ?? null;
            }
        }
        idCache.set(steamId, id);
    }
    return idCache.get(steamId) ?? null;
}

async function gameOverview(id: string): Promise<GameOverviewResponse|null> {
    if (!cache.has(id)) {
        const response = await fetch(`https://api.isthereanydeal.com/games/overview/v2?key=${Config.ITAD.apiKey}`, {
            method: "POST",
            body: JSON.stringify([id])
        });

        if (response.ok) {
            let json = await response.json();
            if (json) {
                json = json as GameOverviewResponse;
                cache.set(id, json);
            }
        } else {
            console.error(response);
            throw new Error("Failed to fetch data");
        }
    }
    return cache.get(id) ?? null;
}

export default {
    gameIdLookup,
    gameOverview
}
