// ==UserScript==
// @name         Hunt for new image to like
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get dat first like on an instagram post woop woop!
// @author       moomoomamoo
// @match        https://www.instagram.com/*
// @grant        none
// ==/UserScript==

/*

PLEASE NOTE THAT USERSCRIPTS CAN BE DANGEROUS TO RUN. ALWAYS REVIEW ANY USERSCRIPT YOU CONSIDER TO USE.
It is best to use this file as a reference for your own work

The comments above are required, please only update the @match param to match whatever site you want this userscript to run on

*/

/* Usage

!Warning - Instagram has safeguards in place for stuff like this. They will prevent http requests after a minute of this script running
You may get locked out of your account if you overuse this script.

Because of how hectic this script can be since it refreshes a lot.
You can safely go to the homepage to avoid any redirects and stop any 'hunts'.

You can force stop a 'hunt' by calling stopHunt or by clearing your localStorage (clear cache)

All methods are added to the global variable (window for browsers). You can call these methods by openning your console on chrome

hunt: function - Will refresh the page over and over again until a new post is found. Once it is found, it will be opened and liked for you.
stopHunt: function - Will stop any 'hunts' you have active.

*/

(function() {
    'use strict';

    const setDelay = (delay) => {
        localStorage.setItem("moo-delay", delay);
    }

    const huntForNextImage = (delay) => {
        // Find the aricle element once it is rendered
        const article = document.querySelector('article');

        if (!article) {
            console.warn("Unexpected missing article");
            setTimeout(() => {
                huntForNextImage();
            }, 1);
            return;
        }
        // End Find the aricle element once it is rendered


        // Record its href (link to that post) and store it in localStorage
        const _a = article.querySelector('a');

        localStorage.setItem("moo-firstHref", _a.href);
        // End Record its href (link to that post) and store it in localStorage

        setDelay(delay);

        // Refresh the page and start the hunt!
        window.location.reload();
    }

    let foundImage = false;
    const searchForNextImage = (firstHref, delay) => {
        // Find the aricle element once it is rendered
        const article = document.querySelector('article');

        if (!article) {
            console.warn("Unexpected missing article");
            setTimeout(() => {
                searchForNextImage(firstHref, delay);
            }, 1);
            return;
        }
        // End Find the aricle element once it is rendered

        // Find the aricle element's first anchor element once it is rendered (should be the first post on the page)
        const _a = article.querySelector('a');

        if (!_a) {
            console.warn("no anchor found");
            setTimeout(() => {
                searchForNextImage(firstHref, delay);
            }, 1);
            return;
        }

        const _aHref = _a.href;
        // End Find the aricle element's first anchor element once it is rendered (should be the first post on the page)

        // Check if the href is different (if it is, this must be a new post, or the newest post was deleted, etc)
        if (_aHref === firstHref) {
            // refresh and try again
            setTimeout(() => {
                console.log(delay);
                location.reload();
            }, delay || 0);
            return;
        }
        // End Check if the href is different (if it is, this must be a new post, or the newest post was deleted, etc)

        // Log this anchor and its href
        console.log(_a);
        console.log(_aHref);
        console.log(firstHref);

        // Click the post
        console.log("Found new image! Clicking it");
        _a.click();
        likeImage();

        // Stop hunting for the newest post
        localStorage.setItem("moo-firstHref", '');
    }

    const likeImage = () => {
        console.log("Looking for like svg");

        // Find the aricle element's first post and click it (to open it if it isn't already opened)
        document.querySelector('article').querySelector('a').click();

        // Get all svgs (icons)
        document.querySelectorAll('svg');

        // Search for the ones that are the 'like' icon
        const likes = document.querySelectorAll("[aria-label='Like']");

        let found = false;
        // Try to click the one was is the 'like' icon
        for (const like of likes) {
            if (like.tagName === 'svg') {
                like.parentNode.click();
                found = true;
            }
        }

        // If the 'icon' icon svg hasn't rendered yet, try again until it is rendered
        if (!found) {
            setTimeout(() => {
                likeImage();
            }, 1);
        }

        // Log that it was clicked
        console.log("FOUND NEW IMAGE AND LIKED");
    }

    // Prevent hunting on feed so I can clear localStorage
    if (!foundImage && location.href !== 'https://www.instagram.com/') {
        const href = localStorage.getItem('moo-firstHref');
        if (href) {
            const delay = +(localStorage.getItem('moo-delay') || 0);
            searchForNextImage(href, delay);
        }
    }

    window.hunt = huntForNextImage;
    window.huntForNextImage = huntForNextImage;
    window.searchForNextImage = searchForNextImage;
    window.likeImage = likeImage;

    window.forceLike = () => {
        localStorage.setItem('moo-firstHref', 'moo');
    }

    window.stopHunt = () => {
        localStorage.setItem('moo-firstHref', '');
    }
})();