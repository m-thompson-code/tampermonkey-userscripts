// ==UserScript==
// @name         Dark souls 3 is a hack n slash confirmed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let's make Dark souls 3 a hack n slash using javascript
// @author       moomoomamoo
// @match        https://store.steampowered.com/
// @grant        none
// ==/UserScript==

/*

PLEASE NOTE THAT USERSCRIPTS CAN BE DANGEROUS TO RUN. ALWAYS REVIEW ANY USERSCRIPT YOU CONSIDER TO USE.
It is best to use this file as a reference for your own work

The comments above are required, please only update the @match param to match whatever site you want this userscript to run on

*/

(function() {
    'use strict';

    // Black Desert Online app ID (game that happens to be shown under hack n slash)
    const APP_ID = '582660';

    // anchor id for Black Desert Online
    const INJECT_HOVER_APP_ID = `hover_app_${APP_ID}`;

    // Dark soul III's hover over html that will replace Black Desert Online's
    const INJECT_HOVER_APP_HTML = `
    <div class="hover_top_area" style="display: none;"></div>
    <h4 class="hover_title">DARK SOULS™ III</h4>
        <div class="hover_release">Released: Apr 11, 2016</div>

            <div class="hover_screenshots">
                        <div class="screenshot" style="background-image: url( https://steamcdn-a.akamaihd.net/steam/apps/374320/ss_1318a04ef11d87f38aebe6d47a96124f8f888ca8.600x338.jpg?t=1553251330  )">

                </div>
                        <div class="screenshot" style="background-image: url( https://steamcdn-a.akamaihd.net/steam/apps/374320/ss_27397db724cfd5648655c1056ff5d184147a4c50.600x338.jpg?t=1553251330  )">

                </div>
                        <div class="screenshot" style="background-image: url( https://steamcdn-a.akamaihd.net/steam/apps/374320/ss_da36c88ae35d4f20c9d221a79592b31c080521d2.600x338.jpg?t=1553251330  )">

                </div>
                        <div class="screenshot" style="background-image: url( https://steamcdn-a.akamaihd.net/steam/apps/374320/ss_12c4d9a3c04d6d340ffea9335441eb2ad84e0028.600x338.jpg?t=1553251330  )">

            </div>
        </div>
    <div class="hover_body">
        <div class="hover_review_summary">
            <div class="title">Overall user reviews:</div>
                <span class="game_review_summary positive">Very Positive</span>
                (95,549 reviews)
            </div>
            <div style="clear: left;"></div>
        </div>
        <div class="hover_body">
        User tags:			<div class="hover_tag_row">
            <div class="app_tag">Souls-like</div><div class="app_tag">Dark Fantasy</div><div class="app_tag">Difficult</div><div class="app_tag">RPG</div><div class="app_tag">Atmospheric</div><div class="app_tag">Lore-Rich</div><div class="app_tag">Third Person</div><div class="app_tag">Exploration</div><div class="app_tag">Story Rich</div><div class="app_tag">Co-op</div><div class="app_tag">Action RPG</div><div class="app_tag">PvP</div><div class="app_tag">Adventure</div><div class="app_tag">Great Soundtrack</div><div class="app_tag">Action</div><div class="app_tag">Open World</div><div class="app_tag">Multiplayer</div><div class="app_tag">Singleplayer</div><div class="app_tag">Replay Value</div><div class="app_tag">Character Customization</div>			</div>
        </div>
    <div class="rule"></div>
    <div class="hover_body_block">
        13 friends own this game:
    </div>
    <div class="friend_blocks_row hover_friends_blocks">
        <div class="playerAvatar online">
            <img id="friend_avatar_img_83925172" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9a/9abbe7974c2fbe9145f18f6178744f5b23dd905a.jpg">
        </div>
        <div class="playerAvatar in-game">
            <img id="friend_avatar_img_994322760" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a2/a29745f0ace9f9669d5003798890f5b4ad44698c.jpg">
        </div>
        <div class="playerAvatar offline">
            <img id="friend_avatar_img_23078247" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/8a/8a00d2093d02f5a7915ea87424dd3deefa728805.jpg">
        </div>
        <div class="playerAvatar online">
            <img id="friend_avatar_img_88004327" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/a4/a40d4001cddffe527f3c60c5f2c2d9a7c9721776.jpg">
        </div>
        <div class="playerAvatar online">
            <img id="friend_avatar_img_94700198" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/31/31ececf0f78a3d92d69c4b213b33bb5a0c4f5524.jpg">
        </div>
        <div class="playerAvatar online">
            <img id="friend_avatar_img_99517842" src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/78/78c89e393635d6b4cc1e62fb570940663ed9c5bc.jpg">
        </div>
        <div style="clear: left;"></div>
    </div>
    `;

    const INJECT_HOVER_APP_HTML_FULL = `
    <div id="${INJECT_HOVER_APP_ID}" style="display: block;">
        ${INJECT_HOVER_APP_HTML}
    </div>
    `;

    // Select the node that will be observed for mutations
    const body = document.body;

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    // Create an observer instance linked to the callback function that will replace the hover over divs for the app with APP_ID
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            // Check if child node has been added or removed (In our case we want to do something when one is added)
            if (mutation.type === 'childList') {
                // look through all added nodes of this mutation
                for(const addedNode of mutation.addedNodes) {
                    // Check to see if steam's hover content div has been added to body
                    if (addedNode.parentElement.id === 'global_hover_content') {
                        // If Black Desert Online's hover content has already been added
                        if (document.getElementById(INJECT_HOVER_APP_ID)) {
                            // Replace it with Dark Soul III's
                            document.getElementById(INJECT_HOVER_APP_ID).innerHTML = INJECT_HOVER_APP_HTML;
                        } else {
                            // If not, add Dark Soul III's hover content
                            addedNode.parentElement.innerHTML += INJECT_HOVER_APP_HTML_FULL;
                        }

                        // Disconnect observer since we don't need it anymore
                        observer.disconnect();
                        break;
                    }
                }
            }
        }
    });



    // Callback function to execute when mutations are observed
    // Create another observer instance linked to the callback function to replace the game's image, href, etc
    const observer2 = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // look through all added nodes of this mutation
                for(const addedNode of mutation.addedNodes) {
                    // Check to see if one of steam's category rows for games has been added
                    if (addedNode.classList && addedNode.classList.contains('home_category_ctn')) {
                        // Get an array of the games
                        const games = document.getElementsByClassName('sale_capsule');

                        for (const game of games) {
                            // If the link to one of the games includes Black Desert Online's app ID
                            if (game.href.indexOf(APP_ID) !== -1) {
                                // Replace the link to Dark Soul III's
                                game.href = "https://store.steampowered.com/app/374320/DARK_SOULS_III/?snr=1_4_wintersale__628";
                                // Update its html to show Dark Soul III's thumbnail, price, discount, etc
                                game.innerHTML = `<div class="sale_capsule_image_ctn"><div class="sale_capsule_image_hover"></div><img class="sale_capsule_image autosize" src="https://steamcdn-a.akamaihd.net/steam/apps/374320/capsule_616x353.jpg?t=1571955419"></div><div class="discount_block  discount_block_inline" data-price-final="399"><div class="discount_pct">-75%</div><div class="discount_prices"><div class="discount_original_price">$59.99</div><div class="discount_final_price">$14.99</div></div></div><div class="ds_options"><div></div></div>`;
                                // Update className to properly keep the thumbnail static while hovering (instead of the mini trailer ones)
                                game.className = 'sale_capsule app_impression_tracked';
                                // Replace some metadata used with steam's javascript (not really needed)
                                game['data-ds-appid'] = '374320';
                                game['data-ds-tagids'] = '';
                                // Disconnect observer since we don't need it anymore
                                observer.disconnect();
                                break;
                            }
                        }
                    }
                }
            }
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(body, config);
    observer2.observe(body, config);
})();
