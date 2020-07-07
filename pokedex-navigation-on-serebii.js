// ==UserScript==
// @name         Navigation buttons for gen 1 pokedex on serebii.net
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Navigation buttons for gen 1 pokedex on serebii.net
// @author       You
// @match        https://serebii.net/pokedex/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addNavButtons(nextUrl, backUrl) {
        if (nextUrl) {
            // Add svg icons for next button
            const nextButtonInnerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 24 24" width="40"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`;

            // Create next floating fab button
            const nextButton = getButton(nextButtonInnerHTML, nextUrl);

            // Add next button
            document.body.appendChild(nextButton);
        }

        if (backUrl) {
            // Add svg icons for back button
            const backButtonInnerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 24 24" width="40"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;

            // Create back floating fab button
            const backButton = getButton(backButtonInnerHTML, backUrl);

            // Adjust backButton to be on the left instead of the right
            backButton.style.right = "auto";
            backButton.style.left = "40px";

            // Add back button
            document.body.appendChild(backButton);
        }
    }

    // Creates a floating fan button (lower right side of the screen)
    function getButton(innerHTML, url) {
        const button = document.createElement( 'a' );

        button.innerHTML = innerHTML;

        // Make the icon white
        button.style.fill = "white";
        button.style.color = "white";
        // Match Medium's main green color
        button.style.background = "rgb(3, 168, 124)";
        // Shape refresh button
        button.style.height = "60px";
        button.style.width = "60px";
        button.style.borderRadius = "50%";

        // Position the button
        button.style.position = "fixed";
        button.style.zIndex = "12341234";
        button.style.bottom = "40px";
        button.style.right = "40px";

        // Align the svg icon in the center
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";

        // Clickable styles
        button.style.cursor = "pointer";

        // Give button hover effect
        button.style.boxShadow="0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)";

        // Link to Twitter with redirect instructions
        button.href = url;

        return button;
    }

    // "https://serebii.net/pokedex/002.shtml" for example
    const url = window.location.href;

    // Exit early if you're not currently looking at a pokedex entry
    if (!url.endsWith('.shtml')) {
        return;
    }

    const urlParts = url.split('/');

    const entry = +(urlParts[urlParts.length - 1].split('.')[0]);

    const nextEntry = entry + 1;
    const backEntry = entry - 1;

    const nextEntryStr = ("" + nextEntry).padStart(3, '0');
    const backEntryStr = ("" + backEntry).padStart(3, '0');

    addNavButtons(nextEntry < 151 ? `https://serebii.net/pokedex/${nextEntryStr}.shtml` : null, backEntry > 0 ? `https://serebii.net/pokedex/${backEntryStr}.shtml` : null);

})();