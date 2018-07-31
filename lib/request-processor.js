const request = require('request')

module.exports = class RequestProcessor {
  constructor ({requestImpl}) {
    this._request = requestImpl || request
  }

  start ({extensionUri, accessToken, resources, authKey}) {
    extensionUri = extensionUri.replace(/\/$/, '')
    const uri = `${extensionUri}/start${(authKey ? `?code=${authKey}` : '')}`

    var substring = ','

    if (resources.includes(substring)) {
      var resourceArray = resources.split(substring)

      for (var value of resourceArray) {
        this._issueAsync({uri,
          method: 'post',
          body: {
            accessToken,
            value
          }})
      }
    } else {
      return this._issueAsync({uri,
        method: 'post',
        body: {
          accessToken,
          resources
        }})
    }
  }

  stop ({extensionUri, accessToken, resources, authKey}) {
    extensionUri = extensionUri.replace(/\/$/, '')
    const uri = `${extensionUri}/stop${(authKey ? `?code=${authKey}` : '')}`

    return this._issueAsync({uri,
      method: 'post',
      body: {
        accessToken,
        resources
      }})
  }

  _issueAsync ({method, uri, body}) {
    return new Promise((resolve, reject) => {
      this._request[method](uri, {
        body: body,
        json: true
      }, (err, res) => {
        if (err) return reject(err)
        else return resolve(res)
      })
    })
  }
}
