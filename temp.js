const fs = require('fs');

const source = fs.readFileSync('./stripcode.json', 'utf8');

const dataset = JSON.parse(source);

console.log(dataset[0]);

const map = {};

const filenames = Object.keys(dataset);

for (const filename of filenames) {
    map[filename] = {};

    const repos = Object.keys(dataset[filename]);

    for (const repo of repos) {
        map[filename][repo] = [];

        map[filename][repo].push(dataset[filename][repo]);
    }
}

fs.writeFileSync('./stripcode2.json', JSON.stringify(map, null, 2));
