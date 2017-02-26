'use strict';
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy')
const Promise = require('bluebird')

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'tujiaw@163.com',
        pass: 'Fighting123'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"tujiaw" <tujiaw@163.com>', // sender address
    to: '', // list of receivers
    subject: '狗狗说登录验证码', // Subject line
    text: '', // plain text body
    html: '' // html body
};

module.exports = {
  getCode: function() {
    const code = speakeasy.totp({
        secret: 'rndog tujiaw',
        digits: 4
    })
    return code
  },
  sendLoginVerifyCode: function(toMail, code) {
    const content = `您的注册登录验证码是:${code}，有效期是30分钟请尽快登录。【狗狗说】`
    mailOptions.to = toMail
    mailOptions.text = content;
    mailOptions.html = `<h3>${content}</h3>`
    return transporter.sendMail(mailOptions)
  }
}
