# `potter plugin <command> <args>`

Manage Potter plugins

`potter plugin` allows you to easily install, remove or list the installed
  plugins for potter. Plugins are installed in your home directory in the
  .potter folder. Potter plugins internally uses npm to manage installation.

Usage:
  potter plugin install <plugin>
  potter plugin remove <plugin>
  potter plugin list

Options:
  -h --help     Show this screen

Examples:

```sh
potter plugin install potter-playdoh-plugin
potter plugin remove potter-playdoh-plugin
potter plugin list
```
