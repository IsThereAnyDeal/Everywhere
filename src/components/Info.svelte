<script lang="ts">
    import {type GameOverviewData} from "../Data/GameOverviewTypes";
    import SteamId from "../Data/SteamId";
    import Button from "./Buttons/Button.svelte";
    import PriceButton from "./Buttons/PriceButton.svelte";

    export let steamId: SteamId;
    export let data: GameOverviewData|null;

    function getPlain(url: string): string|null {
        const m = url.match(/isthereanydeal.com\/game\/(\w+)\/info/);
        return m && m[1] ? m[1] : null;
    }

    let plain: string|null;
    $: plain = getPlain(data?.urls?.info ?? "");
</script>

<div class="parent">
    {#if data && (data.price || data.lowest || data.urls)}
        {#if data.price}
            <PriceButton url={data.price.url}
                         header="Best price now:"
                         discount={data.price.cut}>
                {data.price.price_formatted}

                <div slot="footer">{data.price.store}</div>
            </PriceButton>
        {:else}
            <span data-itad-handled="1" class="noprice">
                No current price found
            </span>
        {/if}

        {#if data.urls?.info}
            <Button url={data.urls.info}>Show all deals</Button>
        {/if}

        {#if data.lowest}
            <PriceButton url={data.lowest.url} header="History low:" discount={data.lowest.cut}>
                {data.lowest.price_formatted}

                <div slot="footer">
                    at {data.lowest.store} {data.lowest.recorded_formatted}
                </div>
            </PriceButton>
        {/if}

        {#if plain}
            <Button url="https://isthereanydeal.com/#/page:game/wait?plain={plain}">
                Wait for better price
            </Button>
        {/if}

        {#if data.urls}
            <Button url={data.urls.history}>
                Price history
            </Button>
        {/if}

        <Button url="https://steampeek.hu?appid={steamId.id}#itadext">
            Browse similar games
        </Button>
    {:else}
        <div class="noinfo">
            Currently there is no information for this game.<br/><br/>
            You can visit our site and browse all deals:

            <Button url="https://isthereanydeal.com/">
                Trending deals
            </Button>
        </div>
    {/if}
</div>


<style>
    .parent {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .noinfo {
        margin: 12px;
    }

    .noprice {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding: 2px;
        font-size: 0.95em;
        font-weight: normal;
        line-height: 20px;
        color: #95969d;
        border-radius: 2px;
        background-color: #282b33;
        margin: 2px 4px;
    }
</style>
