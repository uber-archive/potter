var fs = require('fs');
var path = require('path');
var merge = require('./commands/merge.js');

function mergeCommands(dir, ignore, oldCmds) {
    var recipes;
    //make sure dir exists
    if(fs.existsSync(dir)) {
        recipes = fs.readdirSync(dir)
            .filter(function removeLib(fileName) {
                return ignore.indexOf(fileName) === -1;
            })
            .map(function toFullPath(fileName) {
                return path.join(dir, fileName);
            });
    }

    var commands;

    if (recipes) {
        commands = recipes.reduce(function reduceRecipes(prev, curr) {
            return merge(prev, require(curr));
        }, {});
    } else {
        commands = {};
    }

    if(oldCmds) commands = merge(oldCmds, commands);

    return commands;
}

module.exports = mergeCommands;
