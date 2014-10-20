var chalk = require('chalk');
var childProcess = require('child_process');
var fs = require('fs');
var mkdirp = require('mkdirp');
var parseArgs = require('minimist');
var path = require('path');
var semver = require('semver');
var series = require('run-series');
//var tilde = require('tilde-expansion');
var Wizzard = require('wizzard').Wizzard;

//var merge = require('../lib/commands/merge.js');
var printHelp = require('./help/print-help.js');
var mergeCommands = require('../lib/mergeCmds.js');

//todo improve this with tilde
var potterHome = path.join(process.env.HOME, '.potter');

var commandMap = {
    'install' : install,
    'i': install,
    'remove' : remove,
    'rm': remove,
    'list': list,
    'ls': list,
    'help': halp
};

if (require.main === module) {
    plugin(parseArgs(process.argv.slice(2)), function(err) {
          throw err;
      });
}


function plugin(opts, cb) {
    if(opts._.length === 0) {
        halp();
    } else if(Object.keys(commandMap).indexOf(opts._[0]) !== -1) {
        var cmd = opts._[0];
        opts._ = opts._.slice(1);
        commandMap[cmd](opts, cb);
    }
}

function install(opts, cb) {
    var plugin = opts._[0];
    if (!plugin) cb(new Error(chalk.red('You must provide a plugin to install')));
    var version;
    if(plugin.indexOf('@') && plugin.substr(0,7) !== 'git+ssh') {
        //if only JS had tuples
        version = plugin.split('@');
        plugin = version[0];
        version = (version.length > 1) ? version[1] : null;
    }

    if(plugin.substr(0,7) === 'git+ssh' && plugin.indexOf('#') !== -1) {
        version = plugin.split('#');
        plugin = version[0];
        version = (version.length > 1) ? version[1] : null;
    }

    series([
        //make sure the potter folder exists
        function(cb) {
            fs.exists(potterHome, function(exists) {
                if(exists) {
                    cb(null);
                } else {
                    mkdirp(potterHome, cb);
                }
            });
        },
        //make sure a package.json exists
        function(cb) {
            fs.exists(path.join(potterHome, 'package.json'), function(exists) {
                if(exists) {
                    cb(null);
                } else {
                    var packagejson = '{"dependencies":{}}';
                    fs.writeFile(path.join(potterHome, 'package.json'), packagejson, cb);
                }
            });
        },
        function(cb) {

            //install plugin into ~/.playdoh/node_modules
            //update ~/.playdoh/package.json
            //TODO error handling
            var plugins = require(path.join(potterHome, 'package.json'));
            var deps = plugins.dependencies;
            var found = false;
            //check to see if the plugin has already been installed
            Object.keys(deps).forEach(function(key) {
                var wizz = new Wizzard();
                var upgradeString;
                var depUri;
                var depRef;
                var sDepRef;
                var sVersion;
                var rollback;
                //modules on npm
                if (key === plugin) {
                    found = true;
                    // check if specified version is greater.
                    if(version && semver.gtr(version, deps[key])) {
                        //ask to upgrade if no version
                        upgradeString = 'Do you want to upgrade from ' + deps[key] + ' to ' + version + '?';
                    } else if (version && semver.ltr(version, deps[key])) {
                        //ask to downgrade
                        upgradeString = 'Do you want to downgrade from ' + deps[key] + ' to ' + version + '?';
                    } else {
                        // already installed upgrade?
                        upgradeString = 'Do you want to upgrade from ' + deps[key] + ' to the latest version?';
                    }
                    wizz.addInput(upgradeString, ['y','n']);
                    wizz.on('end', rhb(dealWithIt, null, {name:plugin, version:version, rollback:rollback}, cb));
                    wizz.run();

                } else if(deps[key] === plugin) {
                    found = true;
                    //match exact urls (e.g. git+ssh)
                    console.log(chalk.yellow('This version of ' + key + ' is already installed'));
                    process.exit();
                } else if (deps[key].substr(0,7) === 'git+ssh') {
                    depRef = deps[key].split('#');
                    depUri = depRef[0];
                    depRef = (depRef.length > 1) ? depRef[1] : null;


                    //check if same plugin giturl
                    if(depUri === plugin) {
                        found = true;
                        rollback = key;
                        //now compare refs
                        if((sDepRef = semver.valid(depRef)) && 
                           (sVersion = semver.valid(version))) {
                            if(semver.lt(sDepRef, sVersion)) {
                                //if current version is less than new version ask to upgrade
                                upgradeString = 'Do you want to upgrade from ' + deps[key] + ' to ' + version + '?';

                            } else if(semver.gt(sDepRef, sVersion)) {
                                //if current version is higher than new version ask to downgrade
                                upgradeString = 'Do you want to downgrade from ' + deps[key] + ' to ' + version + '?';

                            } else {
                                //if current version asked to upgrade
                                upgradeString = 'Do you want to upgrade from ' + deps[key] + ' to the latest version?';
                            }
                            wizz.addInput(upgradeString, ['y','n']);
                            wizz.on('end', rhb(dealWithIt, null, {name:plugin, version:version, rollback:rollback}, cb));
                            wizz.run();
                        } else {
                            //at least one of the gitrefs isn't semver
                            //so just ask to upgrade
                            upgradeString = 'Do you want to upgrade from ' + deps[key] + ' to the latest version?';
                            wizz.addInput(upgradeString, ['y','n']);
                            wizz.on('end', rhb(dealWithIt, null, {name:plugin, version:version, rollback:rollback}, cb));
                            wizz.run();
                        }
                    }
                }
            });

            if(!found) {
                installPlugin(plugin, version, null, cb);
            }
        }
    ]);

}


function dealWithIt(input, pkg, cb) {
    if(input[0] === 'y') {
        installPlugin(pkg.name, pkg.version, pkg.rollback, cb);
    } else {
        cb(null);
    }
}

function installPlugin(pkg, version, rollback, cb) {
    var installable = pkg;
    if(version) {
        if(pkg.substr(0,7) === 'git+ssh') {
            installable += '#' + version;
        } else {
            installable += '@' + version;
        }
    }
    var cmd = 'i -S ' + installable;
    console.log('Installing plugin...');
    npm(cmd, potterHome, function validateInstall(err, stdout) {
        //make sure install was success
        //console.log(stderr);
        // console.log(stdout);
        if(err) {
            console.log(chalk.red('NPM install failed!'));
            console.log('Please read the ' + path.join(potterHome, '/npm-debug.log'));
            process.exit();
        }
        console.log('Plugin installed');
        var installed = stdout.match(/^([a-z][-a-z0-9]*)@(\d+\.\d+.\d+ )/m)[1];
        try {
            console.log('Checking for conflicts...');
            var cmds = mergeCommands(path.join(__dirname,'../'), ['lib', 'cli-deprecated.js']);
            mergeCommands(path.join(potterHome,'node_modules'), ['.bin'], cmds);
        /*jshint -W002 */
        } catch (err) {
            console.log(chalk.red('Plugin had conflicts!'));
            console.log('Rolling back...');
            //rollback
            if(rollback) {
                return installPlugin(pkg, rollback, null, cb);
            } else {
                return remove({_:[installed]});
            }
        }

        console.log(chalk.green('Installed Plugin!'));
        process.exit();
    });
}

function npm(cmd, cwd, cb) {
    cmd = 'npm ' + cmd;
    childProcess.exec(cmd, {cwd:cwd}, cb);
}

function remove(opts, cb) {
    var plugin = opts._[0];
    if (!plugin) cb(new Error(chalk.red('You must provide a plugin to remove')));
    console.log(chalk.red('Removing ' + plugin));

    var cmd = 'rm -S ' + plugin;
    npm(cmd, potterHome, function npmRm(err, stdout, stderr) {
        if(err) throw err;

        //console.log(stdout);
        //console.log(stderr);

        if(stderr && stderr.indexOf('npm WARN uninstall not installed') !== -1) {
            return console.log('Plugin ' + plugin + ' was not installed');
        }
        console.log('Removed plugin ' + plugin);
    });
}

function list() {
    var cmd = 'ls | grep "^[└├]"';
    npm(cmd, potterHome, function npmList(err, stdout) {
        if(err) throw err;
        //console.log(stderr);
        var libs = stdout.split('\n');
        libs = libs.map(function(lib) {
            return lib.substr(4);
        }).filter(function(lib) {
            return lib;
        }).forEach(function(lib) {
            var line = chalk.green(' * ') + lib;
            console.log(line);
        });
    });
}

function rhb(fn, scope) {
    //right hand bind
    //call with function, this, arg1, arg2, etc
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function() {
        args = Array.prototype.slice.call(arguments).concat(args);
        fn.apply(scope, args);
    };
}

function halp() {
    return printHelp(path.join(__dirname, 'usage-plugin.md'));
}

plugin.help = halp;

module.exports = plugin;
