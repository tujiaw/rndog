/**
 * Created by tujiaw on 2017/2/22.
 */

'user strict'

const querystring = require('querystring')

const request = {
  post: function(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then((response) => response.json())
  },

  get: function(url, params) {
    if (params) {
      url += '?' + querystring.stringify(params)
    }
    return fetch(url)
      .then((response) => response.json())
  }
}

module.exports = request