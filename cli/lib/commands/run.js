var Wizzard = require('wizzard').Wizzard;
var chalk = require('chalk');

/* runs a command.


*/
module.exports = runCommand;

function runCommand(fn, args, opts) {
    if (!fn) {
        return false;
    }

    opts = opts || {};
    var subCommand = opts.subCommand;

    if (typeof fn === 'function') {
        if (subCommand) {
            if (!fn[subCommand]) {
                return false;
            }
            fn = fn[subCommand];
        }

        fn.apply(null, args);
        return true;
    } else if (typeof fn.command === 'function') {
        if (!fn.expert || opts.argv.expert) {
            if(subCommand) {
                if(!fn.command[subCommand]) {
                    return false;
                }
                fn.command = fn.command[subCommand];
            }
            fn.command.apply(null, args);
            return true;
        } else {
            console.error(chalk.yellow('WARN:'),
                'did you forget to use --expert ?');
            return false;
        }
    }

    var argv = opts.argv || {};
    var fns = fn;
    fn = null;

    if (argv.enum) {
        fn = fns[argv.enum];

        if (!fn) {
            return false;
        }

        if (opts.subCommand) {
            if (!fn.command[opts.subCommand]) {
                return false;
            }

            fn = fn.command[opts.subCommand];
            fn.apply(null, args);
            return true;
        }

        fn.command.apply(null, args);
        return true;
    }

    var keys = Object.keys(fns);
    if (opts.subCommand) {
        keys = keys.filter(function hasSubCommand(key) {
            return !!fns[key].command[subCommand];
        });
    }

    if(!argv.expert) {
        keys = keys.filter(function expert(key) {
            return !fns[key].expert;
        });
    }
    if (keys.length === 1) {
        fn = fns[keys[0]];
        if (opts.subCommand) {
            fn = fn.command[opts.subCommand];
        }

        if (fn.command) {
            fn = fn.command;
        }

        fn.apply(null, args);
        return true;
    }

    if (keys.length === 0) {
        console.error(chalk.yellow('WARN:'),
            'No variants installed, did you forget to use --expert?');
        return true;
    }

    keys.sort();

    promptEnum('Which variant would you like? ', keys,
        function onPrompt(err, cmdName) {
            if (err) {
                var cb = args[args.length - 1];
                if (typeof cb === 'function') {
                    return cb(err);
                } else {
                    throw err;
                }
            }

            args[0].enumCmd = cmdName;

            var fn = fns[cmdName].command;

            if (opts.subCommand) {
                fn = fn[opts.subCommand];
            }

            fn.apply(null, args);
        });
    return true;
}

function promptEnum(msg, options, cb) {
    var wiz = new Wizzard();

    wiz.addInput(msg, options);

    wiz.on('end', function onResult(results) {
        var res = results[0];

        cb(null, res);
    });

    wiz.run();
}
