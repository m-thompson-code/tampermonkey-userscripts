// ==UserScript==
// @name         Bypass New Yorks Times Paywall
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removed paywall prompts and related ui. Forces article content to behave as expected
// @author       You
// @match        https://nytimes.com/*
// @match        https://*.nytimes.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Check for paywall ui overlay and hide it
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const ele of mutation.addedNodes) {
                if (ele.id === 'gateway-content') {
                    ele.style.display = 'none';
                    ele.style.setProperty('display', 'none', 'important');
                    console.log(' ~ Bypass paywall - Removed subscription overlay');
                }
            }
        });
    });

    // Check for gradient ui overlay and hide it
    const removeGradientObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const ele of mutation.addedNodes) {
                const backgroundStyle = window.getComputedStyle(ele).background;

                if (backgroundStyle.includes('gradient')) {
                    ele.style.display = 'none';
                    ele.style.setProperty('display', 'none', 'important');
                    console.log(' ~ Bypass paywall - Removed gradient overlay');
                }
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true
    });

    const appDiv = document.getElementById('app');

    if (appDiv && appDiv.children) {
        for (const childDiv of appDiv.children) {
            observer.observe(childDiv, {
                attributes: true,
                childList: true,
                characterData: true
            });

            if (childDiv && childDiv.children) {
                // Force articles to be scrollable and behave as expected without the paywall in place
                for (const childChildDiv of childDiv.children) {
                    childChildDiv.style.setProperty('position', childChildDiv.style.position || 'static', 'important');
                    childChildDiv.style.setProperty('height', childChildDiv.style.height || 'auto', 'important');
                    childChildDiv.style.setProperty('width', childChildDiv.style.width || 'auto', 'important');
                    childChildDiv.style.setProperty('overflow', childChildDiv.style.overflow || 'visible', 'important');
                    
                    console.log(' ~ Bypass paywall - Forcing article content to be scrollable');

                    removeGradientObserver.observe(childChildDiv, {
                        attributes: true,
                        childList: true,
                        characterData: true
                    });
                }
            }
        }
    }
})();
