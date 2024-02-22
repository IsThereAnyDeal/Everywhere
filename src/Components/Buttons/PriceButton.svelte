<script lang="ts">
    export let url: string|undefined = undefined;
    export let discount: number|undefined;
</script>


<a href={url} target="_blank" rel="noopener" data-itad-e="1">
    <slot name="header"></slot>

    <div class="highlighted">
        {#if discount}
            <div class="cut">-{discount}%</div>
        {/if}
        <span><slot></slot></span>
    </div>

    <slot name="footer"></slot>
</a>


<style>
    a {
        background-color: #31333a;
        font-size: 0.92em;
        padding: 4px;
        margin: 2px 4px;
        display: block;
        font-weight: normal;
        border-radius: 2px;
    }

    .highlighted {
        font-size: 1.6em;
        padding: 2px;
        margin: 1px 0;
        font-weight: bold;
    }

    .cut {
        display: inline-block;
        color: #4caf50;
        margin: 0 4px 0 2px;
        font-size: 0.8em;
    }
</style>
