// ==UserScript==
// @name         Auto twitch bonus channel points
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       moomoomamoo
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

/*

PLEASE NOTE THAT USERSCRIPTS CAN BE DANGEROUS TO RUN. ALWAYS REVIEW ANY USERSCRIPT YOU CONSIDER TO USE.
It is best to use this file as a reference for your own work

The comments above are required, please only update the @match param to match whatever site you want this userscript to run on

*/

(function() {
    'use strict';
    /*

    This script will check the dom every 10 seconds for any element with class 'claimable-bonus__icon' and click it.
    Twitch uses this class for the icon used for the button to claim bonus channel points.
    You can leave the window open and mimimized, etc and you should still collect the points regardless.

    */

    // How many milliseconds between each loop
    const LOOP_TIMER = 10 * 1000;

    // Just for keeping track of how many channel bonus points have been auto claimed
    let twitchBonusCount = 0;

    // Display that auto bonus channel points claimer is active
    console.log("AUTO CLICK BONUS CHANNEL POINTS ON TWITCH ACTIVATED");

    // Check for the bonus icon div and click it
    const claimBonus = () => {
        // Get every element with claimable-bonus__icon class on page
        const elements = document.getElementsByClassName("claimable-bonus__icon");

        // Click any element that uses the twitch claimable-bonus icon
        for (const element of elements) {
            element.click();

            twitchBonusCount += 1;
            // Display that bonus channel points have been claimed and how many times
            console.log("BONUS WAS CLAIMED. Count:", twitchBonusCount);
        }
    }

    // Loop function
    function claimBonusLoop(milliseconds) {
        claimBonus();

        setTimeout(() => {
            claimBonusLoop(milliseconds);
        }, milliseconds);
    }

    // Loop very 10 seconds for that sweet sweet bonus channel points
    claimBonusLoop(LOOP_TIMER);
})();
