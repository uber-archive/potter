# Potter development guidelines

When working on `potter` and it's cli tooling you should pay
  attention to a few core concepts that will help you make
  `potter` a high quality tool.

## Error handling

A solid UX for the `potter` cli is important. We've been bitten
  in the past with little to no error handling which causes very
  cryptic failures for the end users of the `potter` tool.

When your working on potter or a command for potter you should
  always keep an eye on what you do with errors. Where possible
  you should wrap them with more context.

Turning an `ENOENT` error into a `"Your project doesn't have a
  package.json yet. Would you like us to create one"`.

Turning an `command failed` error into a `"We tried to run an 
  arc command with flags: {flags}.\n And we got an unexpected
  exit code: {code}.\n stdout: {stdout}.\n\n
  stderr: {stderr}.\n\n".

## Tracing

The `potter` cli is a complex tool that does many effects with
  `http`, `ssh`, `git`, `arc` & others.

When something goes wrong it's hard to figure out what a root
  cause is without having tracing hooks.

To avoid these issues we must aggressively and pre-emptively add
  tracing for every effect we do so we can figure out exactly
  what the `potter` cli did and where it went wrong.

The recommended approach is using `require('debuglog')` to add
  tracing logging that can be enabled using `NODE_DEBUG`. We
  should use `debuglog` to instrument any effects we do with
  tracing. i.e. library level logging

The other recommendation is using the `logger` in
  `context.logger` in `create.js` and it's `steps`. We should use
  `context.logger` to log about any application level operations
  we do as part of the steps. i.e. application level logging

## Transactions

The `potter` cli runs in an incredible foreign and unforgiving
  environment. It runs on other developers machines and they
  could have done anything possible to them.

When something goes terribly wrong we want to know exactly what
  effects have happened and which have not happened. This will
  allow for either manual or automated rollback.

In the past the users of `potter` had absolutely no way of 
  knowing how to cleanup what they have done when something goes
  wrong. That's not acceptable.

The way we solve this is with the `.potter-log` file. The
  potter log file is our transcation bible. We treat it with the
  upmost respect.

We cannot break back compat on the `.potter-log` file and we 
  cannot corrupt it. We must store information about all effects
  in the log file even if they have failed or are in progress or
  if you don't know anything about the effect anymore.

In the happy case it records the actions the user has taken. In
  the sad case it records exactly what `potter` has done on the
  users behalve.
