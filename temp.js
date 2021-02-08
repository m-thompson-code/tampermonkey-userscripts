const fs = require('fs');

const source = fs.readFileSync('./stripcode.json', 'utf8');

const dataset = JSON.parse(source);

console.log(dataset[0]);

const map = {};

for (const data of dataset) {
    map[data.filename] = map[data.filename] || {};
    map[data.filename][data.correctAnswer] = data.code;
}

fs.writeFileSync('./stripcode2.json', JSON.stringify(map, null, 2));
