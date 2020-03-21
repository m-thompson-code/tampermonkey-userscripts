// ==UserScript==
// @name         No popups
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Preventing sneaky popups causes by iframes and other sneaky techniques
// @author       moomoomamoo
// @match        <REPLACE ME>
// @grant        none
// ==/UserScript==

/*

PLEASE NOTE THAT USERSCRIPTS CAN BE DANGEROUS TO RUN. ALWAYS REVIEW ANY USERSCRIPT YOU CONSIDER TO USE.
It is best to use this file as a reference for your own work

The comments above are required, please only update the @match param to match whatever site you want this userscript to run on

*/

(function() {

    // Replace the open method to do nothing
    const replaceOpen = ((ele) => {
        ele.open2 = ele.open;

        ele.open = ((url, eleName, eleFeatures) => {
            console.warn(" ~ No pops - replaceOpen:", url, eleName, eleFeatures);
        });

        // Used to test if replacing open works (no pop up to google.com should happen)
        ele.open("https://google.com", "_blank");
    });

    // Prevent adding specific event listeners by overriding the addEventListener method
    const replaceAddEventListener = (ele => {
        ele.addEventListener2 = ele.addEventListener;

        ele.addEventListener = ((type, listener, useCapture, wantsUntrusted) => {
            try {
                console.warn(" ~ No pops - replaceAddEventListener:", type, listener, useCapture, wantsUntrusted);

                if (type === 'message' || type === 'focus' || type === 'blur' || type.includes('mouse')) {
                    console.warn(" ~ No pops - replaceAddEventListener:", "Skipping adding event listener");
                    return false;
                }

                return ele.addEventListener2(type, listener, useCapture, wantsUntrusted);
            }catch(error) {
                console.error(" ~ No pops - replaceAddEventListener:", error);
            }
        });
    });

    // Remove any iframes
    const removeIFrames = (() => {
        let count = 0;
        const iframes = document.querySelectorAll('iframe');
        
        for (const iframe of iframes.length) {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }

            count += 1;
        }

        if (count) {
            console.log(" ~ No pops - removeIFrames:", 'removeIFrames', count);
        }
    });

    // Remove any divs that use background-image gif (these gifs may include urls in them that can cause sneaky tricks)
    const removeBadDivs = (() => {
        let count = 0;

        const divs = document.querySelectorAll('div');

        for (const div of divs) {
            if (div.style['background-image'].includes('gif')) {
                div.parentNode.removeChild(div);
                count += 1;
            }
        }

        if (count) {
            console.log(' ~ No pops - removeBadDivs:', count);
        }
    });

    // Prevent opening any thing
    replaceOpen(window);
    replaceOpen(document);

    // Prevent adding sneaky event listeners
    replaceAddEventListener(window);
    replaceAddEventListener(document);

    // Remove any iframes
    removeIFrames();
    // Remove divs with gif backgrounds
    removeBadDivs();

    // Watch for any new iframes or divs with gif backgrounds and remove them
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const ele of mutation.addedNodes) {
                if (ele.tagName === 'IFRAME' || ele.style['background-image'].includes('gif')) {
                    console.warn(" ~ No pops - observed ele: ", ele);
                    console.warn(" ~ No pops - observed ele: Removing the evil nodes", ele.tagName);
                    ele.parentNode.removeChild(ele);
                }
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true
    });
})();
