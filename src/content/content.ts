import Modal from "./Components/Modal.svelte";
import {handleSteamLinks} from "./Handlers/SteamLinksHandler";

const modal = new Modal({
    target: document.body
});

/*
 * TODO figure out a modular interface to allow having more handlers, not just Steam one?
 */

const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
            const target = mutation.target as HTMLElement;

            if (target.closest("#itad_info_container") === null) {
                handleSteamLinks(modal, target);
            }
        }
    }
});

observer.observe(document, { childList: true, subtree: true });
handleSteamLinks(modal);
