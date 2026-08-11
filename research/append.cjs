const fs = require('fs');
const path = require('path');

const recipesFile = path.join(__dirname, '../src/data/recipes.json');
const newRecipesFile = path.join(__dirname, 'newRecipes.json');

const current = JSON.parse(fs.readFileSync(recipesFile, 'utf8'));
const additions = JSON.parse(fs.readFileSync(newRecipesFile, 'utf8'));

const combined = [...current, ...additions];
fs.writeFileSync(recipesFile, JSON.stringify(combined, null, 2), 'utf8');

console.log('Appended ' + additions.length + ' recipes successfully!');
