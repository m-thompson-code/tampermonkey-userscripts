// ==UserScript==
// @name         Inject axios cdn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Inject Axios cdn to do stuff with it
// @author       m.thompson.code@gmail.com
// @match        https://stripcode.dev/ranked
// @grant        none
// ==/UserScript==

function injectAxios() {
    const axiosScript = document.createElement('script');
    axiosScript.setAttribute("id", "axios");
    axiosScript.setAttribute("type", "text/javascript");
    axiosScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");

    document.getElementsByTagName("head")[0].appendChild(axiosScript);

    return axiosScript;
}

// // Should be a thing if you call injectAxios()
let axios;

(function() {
    'use strict';
    const axiosScript = injectAxios();

    axiosScript.onload = () => {
        axios = window.axios;
        // script loaded, do things with axios
    }
})();


// Zombie code that was used to query for the right answer

// Code in main
    // const promises = answers.map(answer => {
    //     return queryRepoFilename(answer.text, filename).then(payload => {
    //         return repoContainsNumber(payload);
    //     });
    // });

    // const answerStateIndexes = await Promise.all(promises);

    // console.log(answerStateIndexes);

    // const correctAnswerIndexes = answerStateIndexes.reduce((acc, curr, i) => {
    //     if (curr) {
    //         acc.push(i);
    //     }

    //     return acc;
    // }, []);

    // console.log(correctAnswerIndexes);

    // if (correctAnswerIndexes.length < 1) {
    //     // TODO: handle not finding a correct answer
    //     console.error("never found a correct answer", answers);
    //     answers[0].element.click();
    //     return;
    // }

    // TODO: figure out how to get the best of the answers
    // Check the file directly using a get request?
    // correctAnswerIndexes.sort((a, b) => {
    //     return b - a;
    // });

    // const correctAnswerIndex = correctAnswerIndexes[0];

    // const correctAnswerEle = answers[correctAnswerIndex].element;
    // // console.log(correctAnswerEle);
    // correctAnswerEle.click();



// async function get(url) {
//     try {
//         const data = (await axios.get(url)).data;

//         requestOffset = 0;

//         return data;
//     }catch(error) {
//         console.error(error);
//         // TODO: handle this offset stuff on 403 error
//         requestOffset += 5;
//     };
// }

// async function queryRepoFilename(repo, filename) {
//     console.log(repo, filename);
//     const github_api_base = `https://api.github.com/search/code`;
//     return await get(`${github_api_base}?q=repo:${repo}+filename:${filename}`).catch(error => {
//         console.error(error);

//         if (error.message === 'Must include at least one user, organization, or repository') {
//             return {
//                 total_count: 0,
//             };
//         }

//         debugger;
//     });
// }

// function repoContainsNumber(payload) {
//     return payload?.total_count || 0;
// }