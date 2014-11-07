'use strict';

module.exports = Command;

function Command(opts) {
    if (!(this instanceof Command)) {
        return new Command(opts);
    }

    this.name = typeof (opts && opts.name) === 'string' ?
        opts.name : '';
    this.commands = (opts && opts.commands) || {};
    this.scaffolds = (opts && opts.scaffolds) || {};
    this.workflows = (opts && opts.workflows) || {};
    this.sharedCommands = (opts && opts.sharedCommands) || {};
    this.__oldCommands = (opts && opts.__oldCommands) || {};
}
