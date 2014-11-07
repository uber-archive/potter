'use strict';
/*jshint newcap:false*/
var TypedError = require('error/typed');
var Command = require('./command.js');

var DuplicateKey = TypedError({
    type: 'mergeCommands.duplicate.key',
    message: 'You have installed commands from {module}.\n' +
        'These was a conflict in {name}.{key}.\n' +
        '{name}.{key} is already defined by {other}.\n' +
        'To fix please either uninstall {module} or resolve ' +
            'the conflict.\n'
});

/*  merges two command objects together.

    This allows you to create the set of sub commands for
        your application from multiple sets of commands

*/

module.exports = mergeCommands;

function mergeCommands(base, cmds) {
    var command = new Command(base);
    cmds = cmds || {};

    // For each type make any direct function assignments into objects
    // Then merge them in and error if they conflict
    ['commands', 'workflows', 'scaffolds'].forEach(function(type) {
        if (cmds[type]) {
            Object.keys(cmds[type]).forEach(function(key) {
                if (cmds[type][key] instanceof Function) {
                    var fn = cmds[type][key];
                    if (type === 'scaffolds') {
                        cmds[type][key] = {command: fn, expert: true}; //default expert to true for gen
                    } else {
                        cmds[type][key] = {command: fn, expert: false};
                    }
                }
            });
            command[type] = safeExtend(command[type],
                cmds[type], error('commands'));
        }
    });

    // Merge in shared commands and error if their variant types conflict
    if (cmds.sharedCommands) {
        var sharedCommands = command.sharedCommands;
        var keys = Object.keys(cmds.sharedCommands);
        keys.forEach(function mergeShared (cmdName) {
            var baseOptions = sharedCommands[cmdName] || {};
            var cmdOptions = cmds.sharedCommands[cmdName];
            Object.keys(cmdOptions).forEach(function(key) {
                if (cmdOptions[key] instanceof Function) {
                    var fn = cmdOptions[key];
                    cmdOptions[key] = {command: fn, expert: false}; //default expert to false
                }

            });
            sharedCommands[cmdName] = safeExtend(baseOptions,
                cmdOptions, error('sharedCommands.' + cmdName));
        });
    }

    command.__oldCommands[cmds.name] = cmds;

    return command;

    function error(name) {
        return function createError(key) {
            var other;
            // find the other command that already defined
            // {name}.{key} on the command object
            var keys = Object.keys(command.__oldCommands);
            keys.some(function findConflict(cmdName) {
                var cmd = command.__oldCommands[cmdName];

                if (cmd[name] && cmd[name][key]) {
                    other = cmdName;
                    return true;
                }
            });

            return DuplicateKey({
                module: cmds.name,
                key: key,
                name: name,
                other: other
            });
        };
    }

}

function safeExtend(left, right, createError) {
    Object.keys(right).forEach(function tryOverwrite(key) {
        if (key in left) {
            throw createError(key);
        }

        left[key] = right[key];
    });
    return left;
}
