import Options from "./Options.svelte";

const root = document.querySelector("#options");
if (root) {
    new Options({
        target: root
    });
}
