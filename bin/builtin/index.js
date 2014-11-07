'use strict';

module.exports = {
    name: 'builtin',
    commands: {
        version: require('./version.js'),
        help: require('./help/'),
        plugin: require('./plugin.js')
    }
};
