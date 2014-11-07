'use strict';
module.exports = waitFor;

function waitFor(expr, reply, proc) {
    var buf = '';
    var stderr = '';

    proc.stdout.on('data', dataListener);
    proc.stderr.on('data', collectStderr);

    proc.on('exit', checkFailure);

    function dataListener(chunk) {
        chunk = String(chunk);
        buf += chunk;

        if (buf.indexOf(expr) !== -1) {
            proc.stdin.write(reply + '\n');
            cleanup();
        }
    }

    function collectStderr(chunk) {
        stderr += String(chunk);
    }

    function checkFailure(exit) {
        console.log('exit', exit);
        console.log('stdout', buf);
        console.log('stderr', stderr);
        process.nextTick(function () {
            throw new Error('stream ended, never saw ' + expr);
        });
    }

    function cleanup() {
        proc.stdout.removeListener('data', dataListener);
        proc.stderr.removeListener('data', collectStderr);
        proc.removeListener('exit', checkFailure);
    }
}
