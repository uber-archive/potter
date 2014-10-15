var package = require('../../package.json');

module.exports = version;

function version() {
    console.log(package.version);
}
