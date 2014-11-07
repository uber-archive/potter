'use strict';
var join = require('path').join;

var getCommand = require('../../lib/commands/get.js');
var runCommand = require('../../lib/commands/run.js');
var printHelp = require('./print-help.js');

var helpFiles = {
    'default': printHelp.bind(null, join(__dirname, 'usage.md'))
};

function help(opts) {
    var section = opts._[0] || 'default';
    var fn = helpFiles[section];

    opts.cmd = 'potter ' + section;
    opts.help = true;

    if (fn) {
        return fn(opts);
    }

    if (!fn && opts._commands) {
        fn = getCommand(opts._commands, section, {
            argv: opts
        });
    }

    var handled = runCommand(fn, [opts], {
        argv: opts,
        subCommand: 'help'
    });

    if (!handled) {
        console.error('Could not find help file for ' + section);
        process.exit(1);
    }
}

module.exports = help;
