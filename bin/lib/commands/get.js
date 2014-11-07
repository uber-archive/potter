'use strict';
/* given some commands object you can get a concrete
    command or sub command.

*/
module.exports = getCommand;

function getCommand(base, section, subsection, opts) {
    if (!base) {
        return null;
    }

    if (typeof subsection === 'object') {
        opts = subsection;
        subsection = null;
    }

    opts = opts || {};

    var fn = getSection(base, section, opts);

    /* something something subsection */

    return fn;
}

function getSection(base, section, opts) {
    if (base.commands[section]) {
        return base.commands[section];
    } else if (base.sharedCommands[section]) {
        return base.sharedCommands[section];
    } else if (section === 'gen') {
        return base.scaffolds;
    } else if (section === 'create') {
        return base.workflows;
    }

    var argv = opts.argv || {};
    var keys = Object.keys(base.aliases || {});
    var fn;

    keys.some(function findAlias(key) {
        if (argv[key]) {
            var section = base.aliases[key];
            fn = getSection(base, section, opts);
            return true;
        }
    });

    if (fn) {
        return fn;
    }

    if (argv._ && argv._.length === 0) {
        return getSection(base,
            base.aliases.__noArguments__, opts);
    }

    return null;
}
