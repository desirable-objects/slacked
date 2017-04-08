# Slacked

[![Build Status](https://travis-ci.org/desirable-objects/slacked.svg?branch=master)](https://travis-ci.org/desirable-objects/slacked)

A slack app for making adding new slash commands to slack easy.

Example is in `packages/demo`
Documentation is in `packages/core` or on [npm](https://npmjs.org/package/slacked)
Plugin example at `packages/plugin-demo`

Install via yarn/npm:

```
yarn add slacked
yarn add slacked-demo-plugin
```

Add some config in `config.json`:

```
{ 
  "plugins": [
    "slacked-demo-plugin"
  ]
}
```

Set your slack token in your environment:

```bash
export SLACK_TOKEN=xxxx
```

Configure the app in your slack instance:

![adding](https://cloud.githubusercontent.com/assets/218949/24829797/8aca909a-1c70-11e7-9742-b7bc1c59136b.png)

Test!

```
/demo your-name
```