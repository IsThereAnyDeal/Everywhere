import browser from "webextension-polyfill";
import type {GameOverviewResponse} from "../../common/_types";
import SteamId from "../../common/SteamId";

// TODO implement better caching
const idCache: Map<SteamId, Promise<string|null>> = new Map();
const cache: Map<string, Promise<GameOverviewResponse|null>> = new Map();

async function gameIdLookup(steamId: SteamId): Promise<null|string> {
    if (!idCache.has(steamId)) {
        let request = browser.runtime.sendMessage({
            api: "gameIdLookup",
            steamId: steamId.toString()
        });
        idCache.set(steamId, request);
    }
    return (await idCache.get(steamId)) ?? null;
}

async function gameOverview(id: string): Promise<GameOverviewResponse|null> {
    if (!cache.has(id)) {
        let request = browser.runtime.sendMessage({
            api: "gameOverview",
            id: id
        });
        cache.set(id, request);
    }
    return (await cache.get(id)) ?? null;
}

export default {
    gameIdLookup,
    gameOverview
}
