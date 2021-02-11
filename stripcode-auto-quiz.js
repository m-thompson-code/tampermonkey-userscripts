// ==UserScript==
// @name         StripCode Cheater
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cheat my way to rank #0
// @author       m.thompson.code@gmail.com
// @match        https://stripcode.dev/ranked
// @grant        none
// ==/UserScript==


// Used to read and write json with stripcode answerBank
let fileHandle;

let answerBank = {};

let lastCodeSeen = "";

(function() {
    'use strict';

    // FileHandle API requires user action to work
    // To get around this, we add a button and click it to start the script
    injectStartButton();
})();

// Inject start button on the lower right corner of the screen
function injectStartButton() {
    const button = document.createElement('button');
    button.innerText = 'Start cheating';
    button.className = `mb-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none`;

    button.style.position = 'fixed';
    button.style.zIndex = 1234567890;
    button.style.bottom = '12px';
    button.style.right = '12px';

    button.onclick = () => {
        main();

        // Hide button after clicking it to avoid clicking it again
        button.style.display = 'none';
    }

    document.body.append(button);
}

async function main() {
    // Start FileHandle API
    await setFileHandle();

    // Get FileHandle permissions
    await verifyPermission(fileHandle, true);

    // Get answer bank from local file
    answerBank = await getFileData();

    // Loop getState()
    updateStateLoop();
}

let loopTimeout;

async function updateStateLoop() {
    await getState();

    const finishedText = document.getElementsByClassName('mt-8 text-lg')?.[0]?.innerText;

    if (finishedText === 'You finished all the questions for this programming language.') {
        console.log("Finished!");
        return;
    }

    clearTimeout(loopTimeout);

    loopTimeout = setTimeout(() => {
        updateStateLoop();
    }, 1000);
}

async function getState() {
    // Get filename, code (code snippet related to file), get answer buttons
    const filename = getFilename();

    if (!filename) {
        console.warn("no filename found");
        return;
    }

    const code = (getCode() || '').trim();

    if (!code) {
        console.warn("no code found");
        return;
    }

    const answers = getAnswers();

    if (!answers || !answers.length) {
        console.warn("no answers found");
        return;
    }
    // END Get filename, code (code snippet related to file), get answer buttons

    // Check for a stored correct answers in answerBank
    const correctAnswerDatas = getCorrectAnswerDatas(filename, code, answers);

    // Search for next question button and click it at some point
    const nextButton = getNextQuestionButton();

    // If the next question button is visible, this should mean that an answer has been selected
    // This also means that the ui should show which answer is correct or incorrect
    if (nextButton) {
        // Check for incorrect answers if they were chosen from our answerBank
        const uiSaysAnswerIsIncorrect = document.getElementsByClassName('text-red-900')?.[0];
        // const uiSaysAnswerIsCorrect = document.getElementsByClassName('text-green-900')?.[0];

        // Check the ui of the app for which answer is correct (the app shows the correct answer after choosing any answer)
        const answerOnScreen = findCorrectAnswer(answers);

        // const existingEntry = answerBank.find(entry => entry.filename === filename && entry.correctAnswer === answerOnScreen.text);
        answerBank[filename] = answerBank[filename] || {};
        answerBank[filename][answerOnScreen.text] = answerBank[filename][answerOnScreen.text] || [];
        const existingEntries = answerBank[filename][answerOnScreen.text];//.find(entry => entry.filename === filename && entry.correctAnswer === answerOnScreen.text);

        if (filename === answerOnScreen.text) {
            debugger;
            throw new Error("filename shouldnt match repo");
        }

        // Update existing entry if the incorrect answer was selected
        let replaced = false;

        for (let i = 0; i < existingEntries.length; i++) {
            const existingEntry = existingEntries[i];

            if (code.includes(existingEntry)) {
                replaced = true;

                if (code.length > existingEntry.length) {
                    existingEntries[i] = code;
                    await saveAnswerBank(answerBank);
                    console.log(" ~ updated entry to answer bank", { filename, text: answerOnScreen.text, code });
                }
                
                break;
            }
        }

        if (!replaced) {
            existingEntries.push(code);
            await saveAnswerBank(answerBank);
            console.log(" ~ added new entry to answer bank", { filename, text: answerOnScreen.text, code });
        }

        // // Update existing entry if the incorrect answer was selected
        // if (existingEntry) {
        //     if (existingEntry.length < code || uiSaysAnswerIsIncorrect) {
        //         answerBank[filename][answerOnScreen.text] = code;
        //         console.log(" ~ updated entry to answer bank", { filename, text: answerOnScreen.text, code });
        //     }
        // } else {
        //     // Add new entry to answerBank
        //     // const newAnswerToAdd = {
        //     //     filename: filename,
        //     //     code: code,
        //     //     correctAnswer: answerOnScreen.text,
        //     // };

        //     if (filename === answerOnScreen.text) {
        //         debugger;
        //         throw new Error("filename shouldnt match repo");
        //     }

        //     answerBank[filename] = answerBank[filename] || {};
        //     answerBank[filename][answerOnScreen.text] = code;

        //     // answerBank.push(newAnswerToAdd);
        //     console.log(" ~ added new entry to answer bank", { filename, text: answerOnScreen.text, code });
        // }
        // // if (existingEntry) {
        // //     if (existingEntry.code.length < code || uiSaysAnswerIsIncorrect) {
        // //         existingEntry.code = code;
        // //         console.log(" ~ updated entry to answer bank", existingEntry);
        // //     }
        // // } else {
        // //     // Add new entry to answerBank
        // //     const newAnswerToAdd = {
        // //         filename: filename,
        // //         code: code,
        // //         correctAnswer: answerOnScreen.text,
        // //     };

        // //     answerBank.push(newAnswerToAdd);
        // //     console.log(" ~ added new entry to answer bank", newAnswerToAdd);
        // // }

        // // Update local file of answerBank
        // await saveAnswerBank(answerBank);

        lastCodeSeen = code;

        if (uiSaysAnswerIsIncorrect) {
            console.error("Got a wrong answer");
            console.error(answers, correctAnswerDatas);
            console.error(answers.map(a => a.text), correctAnswerDatas.slice(0));
            console.error(filename, answerOnScreen.text, code);
        }

        nextButton.click();
        
        return;
    }

    // If there's more than one possible correct answer based on the answer bank, skip picking one
    if (correctAnswerDatas.length > 1) {
        if (lastCodeSeen !== code) {
            console.warn('found more than one possible answer for code snippet', correctAnswerDatas);
        }
    // If there's just one possible correct answer based on the answer bank pick that one
    } else if (correctAnswerDatas.length === 1) {
        const correctAnswerData = correctAnswerDatas[0];
        let matchingAnswer;

        // Validate if correctAnswerData was actually correct
        try {
            // Find the correct answer
            matchingAnswer = answers.find(answer => answer.text === correctAnswerData).element;
            // matchingAnswer = answers.find(answer => answer.text === correctAnswerData.correctAnswer).element;

            // Click the correct answer
            matchingAnswer.click();
        } catch(error) {
            // We expect this to error with element of undefined if it wasn't found
            console.error(error);
            debugger;
        }
    // If there's no possible answer in the answer bank, just pick the first answer
    } else if (!correctAnswerDatas.length) {
        // Just click any answer since we don't know which answer is the right one
        answers[0].element.click();
        console.warn("Clicking first answer since we don't have an entry in answer bank");
    }

    lastCodeSeen = code;
}

// Search ui of app for the filename
function getFilename() {
    return (document.getElementsByClassName('text-4xl')?.[0]?.innerText || '').trim();
}

// Search ui of app for the code snippet
function getCode() {
    return (document.getElementsByClassName('code-half')?.[0].getElementsByTagName('pre')?.[0].innerText || '').trim();
}

// Search ui of app for answers, store the text, button element, correct/incorrect state
function getAnswers() {
    const answerElesContainer = document.getElementsByClassName('answer-half')?.[0];

    if (!answerElesContainer) {
        console.warn("no answer elements container found");
        return;
    }

    const answerEles = answerElesContainer.getElementsByClassName('py-4');

    return Array.from(answerEles).map(ele => {
        const isCorrect = ele.classList.contains('bg-green-100');
        return {
            element: ele,
            text: (ele.getElementsByClassName('text-bblack')[0]?.innerText || ''),
            // correct css includes the css for incorrect (will have both the green and red class)
            isCorrect: isCorrect,
            // Only set the state as incorrect if it's not correct for this reason
            isIncorrect: !isCorrect && ele.classList.contains('bg-red-100'),
        };
    });
}

// Check answers for the correct answer based on the ui
function findCorrectAnswer(answers) {
    return answers.find(answer => answer.isCorrect);
}

// Check answerBank for a correct answer that has matching filename, code snippet, and correctAnswer is included on the answers
// It's important to check if the correctAnswer is included with answers since there are duplicate filenames + code snippets
function getCorrectAnswerDatas(filename, code, answers) {
    const filenameEntries = answerBank[filename] || {};

    const correctAnswerDatas = [];

    for (const answer of answers) {
        // if (filenameEntries[answer.text] && filenameEntries[answer.text].includes(code.trim())) {
        //     correctAnswerDatas.push(answer.text);
        // }

        const codeSnippets = filenameEntries[answer.text] || [];

        for (const codeSnippet of codeSnippets) {
            if (codeSnippet.includes(code)) {
                correctAnswerDatas.push(answer.text);
            }
            break;
        }
    }

    // const correctAnswerDatas = answerBank.filter(entry => {
    //     if (entry.filename !== filename) {
    //         return false;
    //     }

    //     if (!answers.some(answer => answer.text === entry.correctAnswer)) {
    //         return false;
    //     }

    //     if (entry.code.includes(code.trim())) {
    //         return true;
    //     }

    //     return false;
    // });

    return correctAnswerDatas;
}

// Search ui of app for the next question button
function getNextQuestionButton() {
    const answerElesContainer = document.getElementsByClassName('answer-half')?.[0];

    const button = answerElesContainer?.getElementsByClassName('text-white')?.[0];
    
    return button;
}

// File Handler API helpers
// source: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle/requestPermission
async function verifyPermission(fileHandle, withWrite) {
    const opts = {};
    if (withWrite) {
      opts.mode = 'readwrite';
    }
  
    // Check if we already have permission, if so, return true.
    if (await fileHandle.queryPermission(opts) === 'granted') {
      return true;
    }
  
    // Request permission to the file, if the user grants permission, return true.
    if (await fileHandle.requestPermission(opts) === 'granted') {
      return true;
    }
  
    // The user did not grant permission, return false.
    return false;
}

async function setFileHandle() {
    // Allow for json files (which should be an array)
    const pickerOpts = {
        types: [
            {
                description: 'JSON',
                accept: {
                    'application/json': ['.json']
                }
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    };

    fileHandle = (await window.showOpenFilePicker(pickerOpts))[0];
}

async function getFileData() {
    // get answerBank data
    const fileData = await fileHandle.getFile();

    // Used FileReader to transform raw data to string -> json object
    const fr = new FileReader();

    return new Promise(resolve => {
        fr.addEventListener("load", e => {
            // Default value will be empty in case there's an error
            let jsonMap = {};
    
            try {
                jsonMap = JSON.parse(fr.result);
            } catch(error) {
                // This can error if the file is empty, default to an empty
                console.error(error);
            }

            // Update the global answerBank variable
            answerBank = jsonMap;

            resolve(jsonMap);
        });

        fr.readAsText(fileData);
    });
}

// Use FileHandle API to update local answerBank file
async function saveAnswerBank(content) {
    const serializedContent = JSON.stringify(content, undefined, 2);

    // create a FileSystemWritableFileStream to write to
    const writableStream = await fileHandle.createWritable();

    // write our file
    await writableStream.write(serializedContent);
  
    // close the file and write the answerBank to disk.
    await writableStream.close();
}
// END File Handler API helpers
