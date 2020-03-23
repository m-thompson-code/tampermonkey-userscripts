# Various userscripts

I use the tampermonkey extention on Chrome: [https://www.tampermonkey.net/](https://www.tampermonkey.net/)

This allows me to run javascript whenever I visit sites. Here are some of my personal scripts I've written:



## Warning!

Running random javascript that can run on any site you visit from a stranger is a very bad idea! Someone could steal your personal information, steal your passwords, etc. Please do not just use these scripts bindly! If you ever run into a userscript that you don't fully understand, you shouldn't use it. Be safe! :D 



## no-popups-userscript.js
Prevents popups from various sites. Please update @match for your needs.


## no-photobucket-redirects-userscript.js
Prevents photobucket from redirecting you to other pages as a form of forcing you to see ads.


## dark-souls-3-is-a-hack-n-slash-userscript.js
This script made it look like dark souls was a hack n slash game on Steam during one of their sales. This is an inside joke between friends as we like to joking argue whether or not dark souls is a hack n slash. Obviously this script won't work now since Steam has updated their site, but the code is still interesting to reference.

Here are some screenshots and a video of the results of the script:
[Video recording](https://www.youtube.com/watch?v=-BoC6rvFP5U)
[Screenshot](https://cdn.discordapp.com/attachments/613030229958590485/661004912716415038/Hack_n_Slash_2.PNG)



## auto-twitch-channel-bonus-points.js
Auto clicks the treasure chess icon when watching someone's twitch. This can be very useful since you can leave this running while someone's twitch is minimized or on a different tab.



## auto-like-new-instagram-post.js
!Warning - Instagram has safeguards in place for stuff like this. They will prevent http requests after a minute of this script running
You may get locked out of your account if you overuse this script.

Open your Chrome console and use either of these methods to start/stop a 'hunt' for the newest post

`hunt()` - Will refresh the page over and over again until a new post is found. Once it is found, it will be opened and liked for you.
`stopHunt()` - Will stop any 'hunts' you have active.

This script is useful if you want to compete for the first like

