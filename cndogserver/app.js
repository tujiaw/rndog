'use strict'

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const db = 'mongodb://localhost/cndog'

mongoose.Promise = require('bluebird')
mongoose.connect(db)

const modelsDir = path.join(__dirname, '/app/models')
const walk = function(modelsDir) {
  fs.readdirSync(modelsDir).forEach(function(file) {
    const fullpath = path.join(modelsDir, '/' + file)
    const stat = fs.statSync(fullpath)
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(fullpath)
      } else if (stat.isDirectory()) {
        walk(fullpath)
      }
    }
  })
}
walk(modelsDir)

const koa = require('koa')
const logger = require('koa-logger')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const app = koa()
const router = require('./config/routers')()

app.keys = ['rndog']
app.use(logger())
app.use(session(app))
app.use(bodyParser())

app
  .use(router.routes())
  .use(router.allowedMethods())



app.listen(4433)
console.log('listening: 4433')