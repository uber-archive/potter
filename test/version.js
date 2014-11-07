'use strict';
var test = require('tape');
var fmt = require('util').format;
var potter = require('./lib/potter.js');
var expectedVersion = require('../package.json').version;

function getVersionWith(cmd, callback) {
    var label = fmt('print potter version with `potter %s`', cmd);
    test(label, t);

    function t(assert) {
        potter(cmd, assertVersionOutput);

        function assertVersionOutput(err, stdout, stderr) {
            assert.ifError(err, 'No error');
            assert.equal(stderr, '', 'No output on stderr');
            assert.equal(stdout, expectedVersion + '\n',
                'Correct version on stdout');
            assert.end();
        }
    }
}

getVersionWith('version');
getVersionWith('--version');
getVersionWith('-v');
