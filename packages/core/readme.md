# Slacked

A slack app for automation.

Create slack slash commands quickly and easily, as simple node modules.

See the demo in `packages/demo` for a basic example.

## Config

You should export the app token provided to you by slack as the `SLACK_TOKEN` environment variable. 

## Adding slack slash commands

Add new slash commands as plugins - see `packages/demo-plugin` for an example. Register your plugin in `config.json`:

```json
{
  "plugins": [
    "demo"
  ]
}
```

## Plugins

Plugins export three things, an exec method which is called when the command is initiated via slack:

```js
exec: function(who, text, responseUrl)
```

who: the username of the person executing the task
text: all remaining arguments passed after the initial `/slash` command
responseUrl: The out-of-band response url which you can send delayed replies to.

a command getter:

```js
command: <string>
```

Which is the name of the command. For instance `exports.command = 'foo'` would mount the command at the endpoint http://localhost/commands/foo and you could point slack's slash command url at that. It's probably wise to also assign the command `/foo` to this, but it's not mandatory - your slash command can be anything you like.

The built in `demo` command will just say hello to somebody: `/demo <name here>`

and a config setter:

```js
setConfig: function (conf) { ... }
```

which will be passed the relevant config, from the appropriately named key in `config.json`:

```json
{
  "plugins": [
    "demo"
  ],
  "demo": {
    "some": "config"
  }
}
```

## Replies

The `slacked-slack` module handles replies and things. If you throw errors anywhere in your plugins, these will be relayed ephermally to your calling users.

