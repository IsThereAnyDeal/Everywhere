<script lang="ts">
    export let url: string;
</script>


<a target="_blank" rel="noopener" href={url}><slot></slot></a>


<style>
    a {
        display: block;
        padding: 2px;
        font-size: 0.95em;
        font-weight: normal;
        line-height: 20px;
        color: #95969d;
        border-radius: 2px;
        background-color: #282b33;
        margin: 2px 4px;
    }
    a:hover {
        color: white;
    }
</style>
