#!/usr/bin/env node
'use strict';
require('stackup');

var cli = require('./cli.js');

var chalk = require('chalk');

console.log(chalk.red('WARNING') + ': ' + chalk.yellow('playdoh') + 
            ' is deprecated please use ' +
            chalk.yellow('potter'));

cli.callAsCli();
