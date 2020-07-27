// ==UserScript==
// @name         LA Times workaround
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the LA Times paywall and updates the body to be scrollable
// @author       moomoomamoo
// @match        https://latimes.com/*
// @match        https://*.latimes.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
     * 
     * Add a stylesheet rule to the document (it may be better practice
     * to dynamically change classes, so style information can be kept in
     * genuine stylesheets and avoid adding extra elements to the DOM).
     * Note that an array is needed for declarations and rules since ECMAScript does
     * not guarantee a predictable object iteration order, and since CSS is 
     * order-dependent.
     * @param {Array} rules Accepts an array of JSON-encoded declarations
     * @example
    addStylesheetRules([
    ['h2', // Also accepts a second argument as an array of arrays instead
        ['color', 'red'],
        ['background-color', 'green', true] // 'true' for !important rules 
    ], 
    ['.myClass', 
        ['background-color', 'yellow']
    ]
    ]);
    */
    function addStylesheetRules (rules) {
        var styleEl = document.createElement('style');
    
        // Append <style> element to <head>
        document.head.appendChild(styleEl);
    
        // Grab style element's sheet
        var styleSheet = styleEl.sheet;
    
        for (var i = 0; i < rules.length; i++) {
        var j = 1, 
            rule = rules[i], 
            selector = rule[0], 
            propStr = '';
        // If the second argument of a rule is an array of arrays, correct our variables.
        if (Array.isArray(rule[1][0])) {
            rule = rule[1];
            j = 0;
        }
    
        for (var pl = rule.length; j < pl; j++) {
            var prop = rule[j];
            propStr += prop[0] + ': ' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
        }
    
        // Insert CSS Rule
        styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
        }
    }

    addStylesheetRules([
        ['body', // Note that the site naturally doesn't use overflow scrolling, but they have javascript trying to scroll the html tag back to the top, so by using this style trick, we can allow scrolling
            ['max-height', '100vh', true,],
            ['overflow-y', 'auto', true,],
        ],
        ['#reg-overlay',// Overlay gets added mid document start, so we can't just set these 'remove' styles here. We will have to observe when the overlay is added and mess up its styles then
            ['display', 'none', true],
        ],
        ['#ensNotifyBanner',
            ['display', 'none', true],
        ],
    ]);
    
    // Watch for subscription overlay and remove it
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const ele of mutation.addedNodes) {
                if (ele.id === 'reg-overlay') {
                    ele.style.display = 'none';
                    ele.style.setProperty('display', 'none', 'important');
                    console.log(' ~ Bypass paywall - Removed reg-overlay');
                } else if (ele.id === 'ensNotifyBanner') {
                    ele.style.display = 'none';
                    ele.style.setProperty('display', 'none', 'important');
                    console.log(' ~ Bypass paywall - Removed ensNotifyBanner');
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
