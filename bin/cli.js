#!/usr/bin/env node
'use strict';
// such stack trace. so long.
require('stackup');

main.callAsCli = callAsCli;
module.exports = main;

var path = require('path');
var process = require('process');
var parseArgs = require('minimist');
var chalk = require('chalk');
var extend = require('xtend/immutable');

var defaultPrint = require('./lib/default-print.js');
// var verifyVersion = require('./lib/verify-version.js');
var mergeCommands = require('./lib/mergeCmds.js');
var getCommand = require('./lib/commands/get.js');
var runCommand = require('./lib/commands/run.js');

var pluginsDir = path.join(process.env.HOME,'.potter', 'node_modules');
var priorityCmds = ['plugin'];

if (require.main === module) {
    callAsCli();
}

function callAsCli() {
    var argv = parseArgs(process.argv.slice(2), {
        boolean: ['expert', 'dry', 'damp']
    });
    argv.potterVersion = require('../package.json').version;

    //merge builtsin first
    argv._commands = mergeCommands(__dirname, ['lib', 'cli-deprecated.js']);
    main(argv);
}

function main(opts) {
    var extra = opts._.slice();

    // command is --command or first arg
    var command = opts.command || opts._.shift() || null;
    var baseCommands = opts._commands;
    baseCommands.aliases = {
        version: 'version',
        v: 'version',
        h: 'help',
        help: 'help',
        __noArguments__: 'help'
    };
    opts.cmd = 'potter ' + command;

    //run priority commands first
    if (priorityCmds.indexOf(command) !== -1) {
        if (callCommand()) return;
    }

    //run all other commands with plugins to ensure enumeration
    opts._commands = mergeCommands(pluginsDir, ['.bin'], opts._commands);
    if (callCommand()) return;

    // new line for pretty.
    console.log('');

    console.error(chalk.red('ERR:'),
        'command',
        chalk.red(opts.cmd +
            (opts.enum ? ' --enum=' + opts.enum : '')),
        'not found');

    process.exit(1);

    function callCommand() {
        var fn = getCommand(baseCommands, command, {
            expert: opts.expert,
            argv: extend(opts, {
                _: extra
            })
        });

        if (fn) {
            var handled = runCommand(fn, [opts, defaultPrint(command)], {
                argv: opts
            });
            return handled;
        }
    }
}
