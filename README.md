# potter

A tool for generating production apps, Uber style

## Motivation

`potter` is a set of tools for creating and maintaining 
    production apps using best practices developed at Uber.
    It contains scaffolding and workflow tools to help create
    new projects. It also contains tools to make it easy to keep
    up with best practices on existing projects.

`potter` uses a plugin system (powered by npm) in order to make
    it easy to tailor itself to your team's workflow.

## Quickstart

Type `potter create` to run workflows (preferred)
Type `potter gen` to scaffold code

Potter will create a new directory for your project and ask 
you for all the things you need to scaffold up the code.

The `potter create` is preferred because because workflow will also 
    typically create the infrastructure you'll need for you project
    (such as CI testing).

Type `potter plugin` to install new plugins

## Documentation

Type `potter help`

## Installation

Ensure that you install with Node v0.10 or above

`npm install potter -g`

## Tests

`npm test`

## Contributors

 - Tom Croucher (sh1mmer)
 - Jake Verbaten (raynos)
 - Aleksey Smolenchuk (lxe)
 - Matt Morgan (mlmorg)
 - David Ellis
 - Todd Wolfson

## MIT Licenced
