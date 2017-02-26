'use strict'

const Router = require('koa-router')
const User = require('../app/controller/user')
const App = require('../app/controller/app')

module.exports = function() {
  const router = new Router({
    prefix: '/api'
  })

  // user
  router.post('/u/signup', App.hasBody, User.signup)
  router.post('/u/verify', App.hasBody, User.verify)
  router.post('/u/update', App.hasBody, App.hasToken, User.update)
  // app
  router.post('/u/signature', App.hasBody, App.hasToken, App.signature)

  return router
}
