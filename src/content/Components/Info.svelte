<script lang="ts">
    import {Price, PriceData} from "../../common/_types";
    import SteamId from "../../common/SteamId";
    import Button from "./Buttons/Button.svelte";
    import PriceButton from "./Buttons/PriceButton.svelte";

    export let steamId: SteamId;
    export let data: PriceData|null;

    function price(price: Price) {
        return price.amount.toLocaleString("en", {
            style: "currency",
            currency: price.currency
        });
    }
</script>

<div class="parent">
    {#if data && (data.current || data.lowest)}
        {#if data.current}
            {@const current = data.current}
            <PriceButton url={current.url} discount={current.cut}>
                <svelte:fragment slot="header">Best price now:</svelte:fragment>
                {price(current.price)}
                <div slot="footer">{current.shop.name}</div>
            </PriceButton>
            <Button url="https://isthereanydeal.com/{steamId}">Show all deals</Button>
        {:else}
            <span class="noprice">
                No current price found
            </span>
        {/if}

        {#if data.lowest}
            {@const lowest = data.lowest}
            <PriceButton url="https://isthereanydeal.com/id:{data.id}/history/" discount={lowest.cut}>
                <svelte:fragment slot="header">History low:</svelte:fragment>
                {price(lowest.price)}
                <div slot="footer">at {data.lowest.shop.name} {data.lowest.timestamp}</div>
            </PriceButton>
        {/if}

        <Button url="https://steampeek.hu?appid={steamId.id}#itadext">
            Browse similar games
        </Button>
    {:else}
        <div class="noinfo">
            Currently there is no information for this game.
            <Button url="https://isthereanydeal.com/deals/">
                You can visit our site and browse all deals
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
