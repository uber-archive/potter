module.exports = defaultPrint;

function defaultPrint(name) {
    return function printCallback(err, result) {
        if (err) {
            console.log(name + ' failed to complete');
            console.error(err.message);
            return process.exit(1);
        }

        console.log(name + ' finished');
        if (result) console.log(result);
        process.exit(0);
    };
}
