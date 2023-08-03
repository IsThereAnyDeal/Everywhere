import Config from "../config";
import {type GameOverviewResponse, type GameOverviewData} from "./GameOverviewTypes";
import SteamId from "./SteamId";

// TODO implement better caching
const cache: Map<string, GameOverviewData> = new Map();

export async function fetchGameOverview(steamId: SteamId): Promise<GameOverviewData|null> {
    const idStr = steamId.toString();

    if (!cache.has(idStr)) {
        const params = new URLSearchParams({
            key: Config.ITAD.apiKey,
            shop: "steam",
            ids: steamId.toString()
        });

        const feedURL = `https://api.isthereanydeal.com/v01/game/overview/?${params}`;
        const response = await fetch(feedURL);

        if (response.ok) {
            const json = await response.json();
            if (json) {
                const response = json as GameOverviewResponse;

                for (const [id, data] of Object.entries<GameOverviewData>(response.data)) {
                    cache.set(id, data);
                    console.log(id, data);
                }
            }
        } else {
            console.error(response);
            throw new Error("Failed to fetch data");
        }
    }

    return cache.get(idStr) ?? null;
}
