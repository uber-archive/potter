'use strict';
var pkg = require('../../package.json');

module.exports = version;

function version() {
    console.log(pkg.version);
}
