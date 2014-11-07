'use strict';
var expectedVersion = require('../package.json').version;
var assertOutput = require('./lib/assert-output');
var expectedStdout = expectedVersion + '\n';

function checkFn(assert, stdout, stderr) {
    assert.equal(stderr, '', 'No output on stderr');
    assert.equal(stdout, expectedStdout, 'Correct verion on stdout');
}

assertOutput('version', ['version', '--version', '-v'], checkFn);
