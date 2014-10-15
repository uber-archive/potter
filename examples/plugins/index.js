var path = require('path');

// 
var genHelper = require('./potter.enumerated/gen.js');

module.exports = {
    name: 'example', //Name of the plugin
    commands: { //Commands provided
        'command1': {
            'command': fn1, //command function
            'expert': true //Only shows with --expert flag
        },
        'command2': fn2 //command function
    },
    scaffolds: { //Gen templates always expert
        'scaffold1': genHelper(path.join(__dirname, 'templates/scaffold1')) //path to tempaltes
    },
    workflows: { //Create commands
        'workflow1': {
            'command': fn3, //workflow function
            'expert': true //only true
        },
        'workflow2': fn4 //workflow function
    },
    sharedCommands: {
        'jenkins': {
            //same as command but it will offer the switch if there are many variants
            //only 1 variant name allowed per sharedCommand name
            'type1': fn5, //fn to run for varianat
            'type2': {
                'command': fn6, //fn to run for varianat
                'expert': true
            }
        }
    }
};

function fn1(opts, cb) {
  cb(null, 'Hooray fn1');
}
fn1.help = function() {
  console.log('halp');
  return 'halp';
};

function fn2(opts, cb) {
  cb(null, 'Hooray fn2');
}
fn2.help = function() {
  console.log('halp');
  return 'halp';
};

function fn3(opts, cb) {
  cb(null, 'Workflow 1');
}
fn3.help = function() {
  console.log('halp');
  return 'halp';
};

function fn4(opts, cb) {
  cb(null, 'Workflow 2');
}
fn4.help = function() {
  console.log('halp');
  return 'halp';
};

function fn5(opts, cb) {
  cb(null, 'SharedCommand, type1');
}
fn5.help = function() {
  console.log('halp');
  return 'halp';
};

function fn6(opts, cb) {
  cb(null, 'SharedCommand, type2');
}
fn6.help = function() {
  console.log('halp');
  return 'halp';
};
