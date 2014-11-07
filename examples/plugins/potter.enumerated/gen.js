'use strict';
var ngen = require('uber-ngen/bin/ngen.js');

function enumeratedGen(defaults) {
    defaults = defaults || {};
    gen.help = ngen;

    return gen;

    function gen(opts, callback) {
        opts.template = defaults.template;
        opts.directory = defaults.directory;

        return ngen(opts, callback);
    }
}

module.exports = enumeratedGen;
