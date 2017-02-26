'use strict'

const xss = require('xss')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Mail = require('./mail')
const uuid = require('uuid')

exports.signup = function *(next) {
  // phoneNumber暂时用邮箱账号替换
  const phoneNumber = xss(this.query.phoneNumber.trim())
  let user = yield User.findOne({
    phoneNumber: phoneNumber
  }).exec()

  const verifyCode = Mail.getCode()
  if (!user) {
    const token = uuid.v4()
    user = new User({
      nickname: '小狗狗',
      phoneNumber: xss(phoneNumber),
      verifyCode: verifyCode,
      token: token,
      avatar: 'http://sanjiadian.net/images/upload_2bd0fdb82e2ff1a33f5b814b5e313e9b.jpg'
    })
  } else {
    user.verifyCode = '1234'
  }

  try {
    console.log('user:' + user)
    user = yield user.save()
  } catch(e) {
    console.log('user save:' + e)
    this.body = {
      success: false,
      err: '保存用户信息失败，请重试！'
    }
    return next
  }

  try {
    const info = yield Mail.sendLoginVerifyCode(phoneNumber, verifyCode)
    console.log('Message %s sent: %s', info.messageId, info.response)
    this.body = {
      success: true
    }
  } catch(e) {
    console.log(e)
    this.body = {
      success: false,
      err: '发送验证码失败，请检查或更换邮箱重试！'
    }
  }
}

exports.verify = function *(next) {
  const verifyCode = this.query.verifyCode
  const phoneNumber = this.query.phoneNumber
  console.log('code:' + verifyCode)
  console.log('number:' + phoneNumber)
  if (!verifyCode || !phoneNumber) {
    this.body = {
      success: false,
      err: '验证没有通过'
    }
    return next
  }

  let user = yield User.findOne({
    phoneNumber: phoneNumber,
    verifyCode: verifyCode
  }).exec()

  if (user) {
    user.verified = true
    user = yield user.save()
    this.body = {
      success: true,
      data: {
        nickname: user.nickname,
        token: user.token,
        avatar: user.avatar,
      }
    }
  } else {
    this.body = {
      success: false,
      err: '验证未通过'
    }
  }
}

exports.update = function *(next) {
  const body = this.query
  let user = this.session.user
  const fields = 'avatar,gender,age,nickname,breed'.split(',')
  fields.forEach(function(field) {
    if (body[field]) {
      user[field] = xss(body[field].trim())
    }
  })
  user = yield user.save()
  this.body = {
    success: true,
    data: {
      nickname: user.nickname,
      token: user.token,
      age: user.age,
      breed: user.breed,
      gender: user.gender,
      _id: user._id,
    }
  }
}