import Modal from "./Components/Modal.svelte";
import {handleSteamLinks} from "./Handlers/SteamLinksHandler";

const blacklist = [
    "isthereanydeal.com",
    "chat.openai.com",
    "store.steampowered.com/account/licenses/", // issue #1
];

let isBlacklisted = false;
for (const blacklisted of blacklist) {
    if (location.href.indexOf(blacklisted) !== -1) {
        console.log("ITAD Everywhere disabled on " + blacklisted);
        isBlacklisted = true;
        break;
    }
}

if (isBlacklisted) {
    // stop script from running
    throw new Error();
} else {
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
}


