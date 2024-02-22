<script lang="ts">
    import SteamId from "../../common/SteamId";
    import Modal from "./Modal.svelte";

    export let modal: Modal;
    export let id: SteamId;

    let node: HTMLElement;

    function handleHoverStart() {
        modal.open(id, node);
    }

    function handleHoverEnd() {
        modal.close();
    }
</script>


<span role="tooltip" on:mouseenter={handleHoverStart}
      on:mouseleave={handleHoverEnd}
      bind:this={node}>E</span>


<style>
    span {
        all: initial;
        visibility: inherit;
        opacity: inherit;
        pointer-events: auto;
        margin: 0 2px;
        display: inline-block;
        text-decoration: none;
        font-family: "Arial", sans-serif;
        color: #3090ce;
        background: #1a1c21;
        font-weight: bold;
        border: 0;
        border-radius: 2px;
        font-size: 0.95em;
        padding: 1px 4px;
        line-height: 0.95;
        cursor: help;
    }
</style>
