'use strict';
/*eslint no-console:0 */
var console = require('console');
var path = require('path');

var genHelper = require('./potter.enumerated/gen.js');

module.exports = {

    // Name of the plugin
    name: 'example',

    // Commands provided
    commands: {
        'command1': {
            // command function
            'command': fn1,
            // Only shows with --expert flag
            'expert': true
        },
        // command function
        'command2': fn2
    },

    // Gen templates always expert
    scaffolds: {
        // path to templates
        'scaffold1': genHelper(path.join(__dirname, 'templates/scaffold1'))
    },

    // Create commands
    workflows: {
        'workflow1': {
            // workflow function
            'command': fn3,
            // only true
            'expert': true
        },
        'workflow2': fn4 // workflow function
    },

    sharedCommands: {
        // same as command but it will offer the switch if there are many
        // variants.
        // only 1 variant name allowed per sharedCommand name
        'jenkins': {
            // fn to run for variant
            'type1': fn5,
            'type2': {
                // fn to run for variant
                'command': fn6,
                'expert': true
            }
        }
    }
};

function fn1(opts, cb) {
    cb(null, 'Hooray fn1');
}

fn1.help = function fn1Help() {
    console.log('halp');
    return 'halp';
};

function fn2(opts, cb) {
    cb(null, 'Hooray fn2');
}

fn2.help = function fn2Help() {
    console.log('halp');
    return 'halp';
};

function fn3(opts, cb) {
    cb(null, 'Workflow 1');
}

fn3.help = function fn3Help() {
    console.log('halp');
    return 'halp';
};

function fn4(opts, cb) {
    cb(null, 'Workflow 2');
}

fn4.help = function fn4Help() {
    console.log('halp');
    return 'halp';
};

function fn5(opts, cb) {
    cb(null, 'SharedCommand, type1');
}

fn5.help = function fn5Help() {
    console.log('halp');
    return 'halp';
};

function fn6(opts, cb) {
    cb(null, 'SharedCommand, type2');
}

fn6.help = function fn6Help() {
    console.log('halp');
    return 'halp';
};
