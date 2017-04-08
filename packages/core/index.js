'use strict'

const { start } = require('./lib/app')

start()
.catch((e) => {
  console.error(e)
})
