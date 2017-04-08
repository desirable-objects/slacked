'use strict'

const { readdirSync } = require('fs')
const { join } = require('path')

module.exports = readdirSync(__dirname)
  .reduce((curr, file) => {
    if (file !== 'index.js' && !file.includes('.test.')) {
      const path = join(__dirname, file)
      const routes = require(path)
      return curr.concat(routes)
    }
    return curr
  }, [])
