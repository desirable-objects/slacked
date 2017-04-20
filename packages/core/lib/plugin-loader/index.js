'use strict'

const { join } = require('path')

module.exports.load = function () {
  const configFile = process.env.CONFIG_FILE || join(process.cwd(), 'config.json')
  const config = require(configFile)
  return config.plugins.reduce((curr, pluginName) => {
    const plugin = module.parent.require(pluginName)
    const command = plugin.command
    plugin.config = configFile[command]
    curr[command] = plugin
    console.log(`Loaded plugin ${pluginName} as ${command}`)
    return curr
  }, {})
}
