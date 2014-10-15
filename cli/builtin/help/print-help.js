var fs = require('fs');
var msee = require('msee');
var process = require('process');

module.exports = printHelp;

function printHelp(opts, settings) {
    settings = settings || {};
    if (typeof opts === 'string') {
        opts = { files: [opts] };
    }

    settings = settings || {};

    var content = opts.files.map(function (fileName) {
        return fs.readFileSync(fileName, 'utf8');
    }).join('\n');

    var text = msee.parse(content, {
        paragraphStart: '\n'
    }) + '\n';

    var lines = text.split('\n').length;
    var consoleLines = process.stdout.rows;

    if (lines < consoleLines || !settings.pager || !process.stdout.isTTY) {
        return console.log(text);
    } else {

      var pager = Pager({ pager: 'less' });

      pager.write(text);
      return pager.end();
    }
}

var spawn = require('child_process').spawn;

function Pager(opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }

    if (!opts) {
        opts = {};
    }

    var pager = opts.pager || process.env.PAGER || 'more';

    setRaw(true);
    var ps = spawn(pager, ['-R'], { customFds: [ null, 1, 2 ] });

    ps.on('exit', function (code, sig) {
        setRaw(false);
        process.stdin.pause();
        if (typeof cb === 'function') {
            cb(code, sig);
        }
    });

    return ps.stdin;
}

var tty = require('tty');
function setRaw(mode) {
    return process.stdin.setRawMode ?
        process.stdin.setRawMode(mode) : tty.setRawMode(mode);
}
