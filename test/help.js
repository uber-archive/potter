'use strict';
var assertOutput = require('./lib/assert-output');

function checkHelp(assert, stdout, stderr) {
    assert.equal(stderr, '', 'No output on stderr');
    assert.notEqual(stdout.indexOf('potter [command]'), -1, 'Printed help');
}

assertOutput('help', ['help', '--help', '-h', ''], checkHelp);

function checkGenHelp(assert, stdout, stderr) {
    assert.notEqual(stderr.indexOf('No variants installed'), -1);
    assert.equal(stdout, '', 'No output on stdout');
}

assertOutput('help gen', 'help gen', checkGenHelp);

function checkCreateHelp(assert, stdout, stderr) {
    assert.notEqual(stderr.indexOf('No variants installed'), -1);
    assert.equal(stdout, '', 'No output on stdout');
}

assertOutput('help create', 'help create --pager=false', checkCreateHelp);
