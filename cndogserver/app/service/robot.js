'use strict'

const qiniu = require('qiniu')
const config = require('../../config/config')

qiniu.conf.ACCESS_KEY = config.qiniu.ak
qiniu.conf.SECRET_KEY = config.qiniu.sk

const bucket = 'images'

function uptoken(bucket, key) {
  const putPolicy = new qiniu.rs.putPolicy(bucket + ':' + key)
  return putPolicy.token()
}

exports.getQiniuToken = function(key) {
  const token = uptoken(bucket, key)
  return token
}
