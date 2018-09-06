const request = require('request')
const os = require('os')
const uuidv4 = require('uuid/v4')
const logger = require('./logger')
module.exports = class RequestProcessor {
  constructor ({requestImpl}) {
    this._request = requestImpl || request
    this._logger = logger
  }

  _log ({extensionUri, accessToken, resources, type}) {
    this._logger.log(JSON.stringify({
      'id': uuidv4(),
      'type': type,
      'user': accessToken.substr(7, 16), // get the first 16 characters of the user's access token
      'system': `${os.hostname()}-${os.type()}`,
      'date': new Date().toISOString(),
      'resource': resources,
      'event': extensionUri
    }))
  }

  start ({extensionUri, accessToken, resources, authKey}) {
    if (typeof extensionUri !== 'string') {
      return Promise.reject(new Error('ExtensionUri is a required string argument'))
    }
    extensionUri = extensionUri.replace(/\/$/, '')
    const uri = `${extensionUri}/start${(authKey ? `?code=${authKey}` : '')}`

    var substring = ','

    if (resources.includes(substring)) {
      var resourceArray = resources.split(substring)

      for (var value of resourceArray) {
        this._log({ extensionUri, accessToken, value, type: 'initiate' })
        this._issueAsync({uri,
          method: 'post',
          body: {
            accessToken,
            value
          }})
      }
    } else {
      this._log({ extensionUri, accessToken, resources, type: 'initiate' })
      return this._issueAsync({uri,
        method: 'post',
        body: {
          accessToken,
          resources
        }})
    }
  }

  stop ({extensionUri, accessToken, resources, authKey}) {
    if (typeof extensionUri !== 'string') {
      return Promise.reject(new Error('ExtensionUri is a required string argument'))
    }
    extensionUri = extensionUri.replace(/\/$/, '')
    const uri = `${extensionUri}/stop${(authKey ? `?code=${authKey}` : '')}`
    this._log({ extensionUri, accessToken, resources, type: 'terminate' })
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
