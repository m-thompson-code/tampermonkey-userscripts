const fs = require('fs');

const source = fs.readFileSync('./stripcode.json', 'utf8');

const dataset = JSON.parse(source);

// console.log(dataset[0]);

// const map = {};

// const filenames = Object.keys(dataset);

// for (const filename of filenames) {
//     map[filename] = {};

//     const repos = Object.keys(dataset[filename]);

//     for (const repo of repos) {
//         map[filename][repo] = [];

//         map[filename][repo].push(dataset[filename][repo]);
//     }
// }

const filenames = Object.keys(dataset);

for (const filename of filenames) {
    const repos = Object.keys(dataset[filename]);

    for (const repo of repos) {
        const codeSnippets = dataset[filename][repo];

        for (let i = 0; i < codeSnippets.length; i++) {
            for (let j = 0; j < codeSnippets.length; j++) {
                const codeA = codeSnippets[i];
                const codeB = codeSnippets[j];

                if (i === j) {
                    continue;
                }

                if (codeB.includes(codeA)) {
                    console.log(filename, repo);
                }
            }
        }
        // for (const codeSnippet of codeSnippets) {
        //     if (codeSnippets.includes(codeSnippet)) {
        //         console.log(filename, repo);
        //     }
        // }
    }
}

// fs.writeFileSync('./stripcode2.json', JSON.stringify(map, null, 2));
