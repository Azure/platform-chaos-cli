const msRest = require('ms-rest-azure')

module.exports = class AzureAuthenticator {
  constructor ({msRestImpl}) {
    this._msRestImpl = msRestImpl || msRest
  }

  interactiveToken () {
    return this.interactive()
      .then((authObj) => {
        return new Promise((resolve, reject) => {
          authObj.retrieveTokenFromCache((err, type, value) => {
            if (err) return reject(err)
            resolve(`${type} ${value}`)
          })
        })
      })
  }

  interactive () {
    return this._msRestImpl.interactiveLogin()
  }
}
