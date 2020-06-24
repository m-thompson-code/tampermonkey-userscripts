// ==UserScript==
// @name         Bypass Medium's paywall on articles
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass Medium's paywall on articles. You can uncomment the oneliner (and only use that line of code) to mess up the site's cookies (but you won't be able to sign in anymore). Or use the rest code as is to take advantage of Twitch redirects to Medium always bypasses the paywall.
// @author       moomoomamoo
// @match        https://medium.com/*
// @match        https://*.medium.com/*
// @match        https://t.co/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Note that if you don't have a Medium account or will create one, you could avoid all this by using the following one liner.
// By messing up the uid in Medium's cookies, we get to avoid Medium ever figuring out how many posts we've viewed this month
// You won't be able to log in anymore, but the site won't block you from viewing content (Until you clear this value or clear your cache)

// document.cookie = "uid=bypass-" + Date.now();

// If you want to maintain your login, here is a redirect trick that takes advantage of Medium allowing content from any redirects coming from Twitter

// Check if we have been redirected from Twitch
if (location.href.startsWith("https://medium") && !document.referrer.includes('t.co')) {
    // If not let's redirect to Twitch with query params that contains current Medium url to redirect back from Twitch (code below will handle redirecting back from Twitch)

    const twitchRedirectUrl = "https://t.co/?moo=" + encodeURIComponent(location.href);
    // Redirect using meta tag so this redirect doesn't affect the history of the browser
    const meta = document.createElement('meta');
    meta.httpEquiv = "refresh";
    meta.content = `0; URL=${twitchRedirectUrl}`;
    document.getElementsByTagName('head')[0].appendChild(meta);

    // Redirect using javascript incase redirect using meta tag fails
    window.location.replace(twitchRedirectUrl);
} else {
    // Override referrer, so we can continue using this trick to bypass paywall
    // Note that document.referrer normally is read-only, but by defining a getter allows us to bypass this restriction
    Object.defineProperty(document, "referrer", {get : function(){ return "bypassed :D"; }});

    // Sometimes Medium navigates without redirecting (which breaks this logic)
    // When this happens, you'll need to refresh the page (or click this built in refresh button)
    // Add refresh button just for kicks (you could just refresh using your browser's refresh button, but where's the fun in that?)
    window.onload = () => {
        addRefreshButton();
    }
}

const mediumRedirect = new URLSearchParams(window.location.search).get('moo');

// Check if we have our special instructions in our query params
if (location.href.startsWith("https://t.co") && mediumRedirect) {
    // Hide the ugly redirect happening
    document.body.style.display = "none";

    // Redirect using meta tag so this redirect doesn't affect the history of the browser
    const meta = document.createElement('meta');
    meta.httpEquiv = "refresh";
    meta.content = `0; URL=${mediumRedirect}`;
    document.getElementsByTagName('head')[0].appendChild(meta);

    // Redirect using javascript incase redirect using meta tag fails
    window.location.replace(mediumRedirect);
};

// We might want to refresh since parts of the Medium site navigates without refreshing (single page application)
// You could just refresh the browser, or click this fancy button instead ;D
function addRefreshButton() {
    const refreshButton = document.createElement( 'a' );

    // Add refresh svg icon
    refreshButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 24 24" width="40"><path d="M0 0h24v24H0z" fill="none"/><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
    `;

    // Make the icon white
    refreshButton.style.fill = "white";
    refreshButton.style.color = "white";
    // Match Medium's main green color
    refreshButton.style.background = "rgb(3, 168, 124)";
    // Shape refresh button
    refreshButton.style.height = "60px";
    refreshButton.style.width = "60px";
    refreshButton.style.borderRadius = "50%";

    // Position the button
    refreshButton.style.position = "fixed";
    refreshButton.style.zIndex = "12341234";
    refreshButton.style.bottom = "40px";
    refreshButton.style.right = "40px";

    // Align the svg icon in the center
    refreshButton.style.display = "flex";
    refreshButton.style.alignItems = "center";
    refreshButton.style.justifyContent = "center";

    // Clickable styles
    refreshButton.style.cursor = "pointer";

    // Give button hover effect
    refreshButton.style.boxShadow="0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)";

    // Link to Twitter with redirect instructions
    refreshButton.href = "https://t.co/?moo=" + encodeURIComponent(location.href);

    // Add button
    document.body.appendChild(refreshButton);
}

})();
