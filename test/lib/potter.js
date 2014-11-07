'use strict';
var exec = require('child_process').exec;
var path = require('path');

var cli = path.join(__dirname, '../../bin/cli.js');
var istanbul = path.join(__dirname, '../../node_modules/.bin/istanbul');
var coverageFolder = path.join(__dirname, '../../coverage');
var count = 0;

module.exports = potter;

function potter(cmd, opts, callback) {
    if(typeof opts === 'function') {
        callback = opts;
        opts = {};
    }
    return spawnChild(cli, cmd, opts, callback);
}

function spawnChild(file, args, opts, callback) {
    /*jshint camelcase: false */
    var isIstanbul = process.env.running_under_istanbul;

    var cmd;
    // istanbul can't actually cover processes that crash.
    // so there is little point as it doesn't add much coverage
    // in the future it will https://github.com/gotwarlost/istanbul/issues/127

    if (isIstanbul) {
        cmd = istanbul + ' cover ' + file + ' --report cobertura' +
            ' --print none' +
            ' --root ' + process.cwd() +
            ' --dir ' + coverageFolder + '/multiple' +
            count + ' -- ' + args;
    } else {
        cmd = 'node ' + file + ' ' + args;
    }
    count++;
    return exec(cmd, opts, beSilent);

    function beSilent(err, stdout, stderr) {
        if (stderr) {
            stderr = stderr.replace('No coverage information ' +
                'was collected, exit without writing coverage ' +
                'information\n', '');
        }

        callback(err, stdout, stderr);
    }
}
