<script lang="ts">
    import {tick} from "svelte";
    import {fade} from "svelte/transition";
    import {PriceData} from "../Data/_types";
    import Api from "../Data/Api";
    import SteamId from "../Data/SteamId";
    import {getCoords, keepInViewPort} from "../utils";
    import Info from "./Info.svelte";

    const HideDelay = 200;

    let container: HTMLElement;

    let displayTimer: number|undefined;

    let steamId: SteamId;

    let isOpen: boolean = false;
    let dataPromise: Promise<PriceData|null>|undefined;

    export function open(steamId_: SteamId, attachTo: HTMLElement) {
        steamId = steamId_;

        if (displayTimer) { clearTimeout(displayTimer); }
        isOpen = true;

        dataPromise = undefined;
        (async function () {
            await tick();
            position(attachTo);
            keepInViewPort(container);

            dataPromise = (async function() {
                const id = await Api.gameIdLookup(steamId);
                const response = id === null ? null : await Api.gameOverview(id);
                return response?.prices.find(o => o.id === id) ?? null
            })()
            await tick();
            keepInViewPort(container);
        })();
    }

    function position(target: HTMLElement) {
        const { left, top, right, bottom } = target.getBoundingClientRect();
        const popupOffset = 8; // moves the popup under the cursor
        container.style.left = getCoords(target).left + (right - left) - popupOffset + "px";
        container.style.top = getCoords(target).top + (bottom - top) - popupOffset + "px";
    }

    export function close() {
        displayTimer = setTimeout(() => isOpen = false, HideDelay);
    }

    function handleEnter() {
        if (displayTimer) { clearTimeout(displayTimer); }
        isOpen = true;
    }
</script>

{#if isOpen}
    <div role="tooltip" id="itad_info_container"
         bind:this={container}
         on:mouseenter={handleEnter}
         on:mouseleave={close}
         transition:fade|local={{duration: 200}}
    >
        <a class="header" href="https://isthereanydeal.com" target="_blank" rel="noopener">
            IsThereAnyDeal
        </a>

        {#if dataPromise}
            {#await dataPromise}
                <div>Loading&hellip;</div>
            {:then data}
                <Info {steamId} {data} />
            {:catch e}
                Oops, something went wrong
                {e.message ?? ""}
            {/await}
        {/if}
    </div>
{/if}


<style>
    #itad_info_container {
        all: initial;
        font-family: "Arial", sans-serif;
        background-color: #1a1c21;
        padding: 2px;
        font-size: 12px;
        width: 190px;
        min-height: 75px;
        position: absolute;
        transition-property: visibility, opacity;
        transition-duration: 0s, 0.4s;
        z-index: 1000009;
        word-break: break-word;
        text-align: center;
        color: #ccc;
        text-decoration: none;
        border-radius: 2px;
        border: 0;
        display: flex;
        flex-direction: column;
    }

    a {
        display: inline-block;
        color: white;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        font-size: 0.95em;
        padding: 2px;
    }
    a:hover {
        color: white;
        background-color: #454957;
    }
</style>
