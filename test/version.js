'use strict';
var test = require('tape');
var parallel = require('run-parallel');

var potter = require('./lib/potter.js');
var expectedVersion = require('../package.json').version;

test('potter version', function t(assert) {
    potter('version', function onVersion(err, stdout, stderr) {
        assert.ifError(err);
        assert.equal(stderr, '');
        assert.equal(stdout, expectedVersion + '\n');
        assert.end();
    });
});

test('potter version aliases', function t(assert) {
    parallel({
        v: potter.bind(null, '-v'),
        version: potter.bind(null, '--version')
    }, function (err, results) {
        assert.ifError(err);
        var keys = Object.keys(results);
        keys.forEach(function (key) {
            var stdout = results[key];
            assert.equal(stdout, expectedVersion + '\n');
        });
        assert.end();
    });
});
