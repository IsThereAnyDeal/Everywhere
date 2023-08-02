const itadInlineIcon = (appIDs: RegExpMatchArray) => {
    const elementToAppend = document.createElement("span");
    elementToAppend.dataset.itadId = appIDs[1] + "/" + appIDs[2];
    elementToAppend.classList.add("itad_everywhere");
    elementToAppend.textContent = "E";

    return elementToAppend;
};

export default itadInlineIcon;
