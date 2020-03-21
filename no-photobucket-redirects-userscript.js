// ==UserScript==
// @name         Prevent photobucket from redirecting
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevents photobucket from redirecting you to other pages as a form of forcing you to see ads
// @author       moomoomamoo
// @match        *://*.photobucket.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const getStub = (tag) => {
        return (...args) => {
        console.log("STUB TIME", ...args);
    }};

    window.history.replaceState = getStub('history.replaceState');
    window.location.replace = getStub('location.replace');
})();
