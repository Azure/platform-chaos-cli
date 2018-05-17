const assert = require('assert')
const factory = require('../').factory

/* eslint-env node, mocha */

describe('azure-chaos', () => {
  describe('AzureAuthenticator', () => {
    it('should parse and format token successfully', (done) => {
      factory.AzureAuthenticator.configure({
        msRestImpl: {
          interactiveLogin: () => {
            return Promise.resolve({
              retrieveTokenFromCache: (cb) => {
                cb(null, 'testAuthType', 'testAuthValue')
              }
            })
          }
        }
      })

      const instance = factory.AzureAuthenticator.create()

      instance.interactive()
        .then((res) => {
          assert.equal(res, 'testAuthType testAuthValue')
        })
        .then(done, done)
    })
  })
  describe('RequestProcessor', () => {
    it('should successfully transform an extension uri', (done) => {
      factory.RequestProcessor.configure({
        requestImpl: {
          post: (calledUri, options, cb) => {
            var response = {calledUri, options}
            return cb(null, response)
          }
        }
      })

      const instance = factory.RequestProcessor.create()
      const testUri = 'testUri/sample'

      instance.start({
        extensionUri: testUri,
        resources: 'test/samplegroup/sampleresourceid',
        authKey: 'testAuthKey',
        accessToken: 'testAccessToken'
      }).then((res) => {
        assert.equal(res.calledUri, `${testUri}/start?code=testAuthKey`)
        assert.equal(res.options.body.accessToken, 'testAccessToken')
        assert.equal(res.options.body.resources, 'test/samplegroup/sampleresourceid')
      })
        .then(done, done)
    })

    it('should fail when a null is passed in as an extension uri', (done) => {
      factory.RequestProcessor.configure({
        requestImpl: {
          post: (calledUri, options, cb) => {
            var response = {calledUri, options}
            return cb(null, response)
          }
        }
      })

      const instance = factory.RequestProcessor.create()
      const testObject = {
        expectedExtensionUri: null,
        expectedResources: 'test/samplegroup/sampleresourceid',
        expectedAuthKey: 'testAuthKey',
        expectedAccessToken: 'testAccessToken'
      }

      instance.start({
        extensionUri: testObject.expectedExtensionUri,
        resources: testObject.expectedResources,
        authKey: testObject.expectedAuthKey,
        accessToken: testObject.expectedAccessToken
      }).then((res) => {
        assert.throws(res.calledUri, null)
      })
        .then(done, done)
    })

    it('should handle a backslash passed in an extension uri', (done) => {
      factory.RequestProcessor.configure({
        requestImpl: {
          post: (calledUri, options, cb) => {
            var response = {calledUri, options}
            return cb(null, response)
          }
        }
      })

      const instance = factory.RequestProcessor.create()

      const testUri = 'testUri/sample\backslash'
      const testResource = 'test/samplegroup/sampleresourceid'
      const testAuthKey = 'testAuthKey'
      const testAccessToken = 'testAccessToken'

      instance.start({
        extensionUri: testUri,
        resources: testResource,
        authKey: testAuthKey,
        accessToken: testAccessToken
      }).then((res) => {
        assert.equal(res.calledUri, testUri + '/start' + '?code=testAuthKey')
      })
        .then(done, done)
    })
  })
})
