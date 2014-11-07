'use strict';
var test = require('tape');
var parallel = require('run-parallel');
var potter = require('./lib/potter.js');

test('potter help', function t(assert) {
    potter('help', function onHelp(err, stdout, stderr) {
        assert.ifError(err);
        assert.equal(stderr, '');
        assert.notEqual(stdout.indexOf('potter [command]'), -1);
        assert.end();
    });
});

test('potter help aliases', function t(assert) {
    parallel({
        h: potter.bind(null, '-h'),
        help: potter.bind(null, '--help'),
        none: potter.bind(null, '')
    }, function onHelps(err, results) {
        assert.ifError(err);

        var keys = Object.keys(results);
        keys.forEach(function assertKey(key) {
            var stdout = results[key];

            assert.notEqual(
                stdout.indexOf('potter [command]'), -1);
        });

        assert.end();
    });
});

test('potter help gen', function t(assert) {
    potter('help gen', function onHelp(err, stdout, stderr) {
        assert.ifError(err);
        assert.notEqual(stderr.indexOf('No variants installed'), -1);
        assert.equal(stdout, '');
        assert.end();
    });
});

test('potter help create', function t(assert) {
    potter('help create --pager=false', function onHelp(err, stdout, stderr) {
        assert.ifError(err);
        assert.notEqual(stderr.indexOf('No variants installed'), -1);
        assert.equal(stdout, '');
        assert.end();
    });
});

