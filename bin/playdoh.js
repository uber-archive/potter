#!/usr/bin/env node
/*eslint no-console:0 */
'use strict';
require('stackup');
var console = require('console');
var chalk = require('chalk');

var potterCli = require('./potter.js');

console.log(chalk.red('WARNING') + ': ' + chalk.yellow('playdoh') +
            ' is deprecated please use ' + chalk.yellow('potter'));

potterCli.callAsCli();
