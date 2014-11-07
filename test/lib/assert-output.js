'use strict';
var test = require('tape');
var fmt = require('util').format;
var partial = require('partial');
var potter = require('./potter.js');

function assertOutput(name, cmd, checkFn) {

    if (Array.isArray(cmd)) {
        cmd.forEach(partial(getOutputFor, name));
    } else {
        getOutputFor(name, cmd);
    }

    function getOutputFor(name, cmd) {
        var testLabel = fmt('print potter %s with `potter %s`', name, cmd);
        test(testLabel, t);

        function t(assert) {
            potter(cmd, partial(assertVersionOutput, assert));
        }
    }

    function assertVersionOutput(assert, err, stdout, stderr) {
        assert.ifError(err, 'No error');
        checkFn(assert, stdout, stderr);
        assert.end();
    }
}

module.exports = assertOutput;
