'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')
const robot = require('../service/robot')

exports.signature = function *(next) {
  const key = this.query.key
  if (key) {
    token = robot.getQiniuToken(key)
    this.body = {
      success: true,
      data: token
    }
  } else {
    this.body = {
      success: false,
      err: 'get qiniu key failed!'
    }
  }
}

exports.hasBody = function *(next) {
  const query = this.query || {}
  if (Object.keys(query).length === 0) {
    this.body = {
      success: false,
      err: '是不是漏掉什么了?'
    }
    return next
  }
  yield next
}

exports.hasToken = function *(next) {
  let token = this.query.token
  if (!token) {
    token = this.request.body.token
  }
  if (!token) {
    this.body = {
      success: false,
      err: '钥匙丢了'
    }
    return next
  }

  const user = yield User.findOne({
    token: token
  }).exec()

  if (!user) {
    this.body = {
      success: false,
      err: '用户没登录'
    }
    return next
  }
  this.session = this.session || {}
  this.session.user = user
  yield next
}