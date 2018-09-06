const assert = require('assert')
const factory = require('../').factory
const logger = require('../lib/logger')
const sinon = require('sinon')
/* eslint-env node, mocha */

describe('RequestProcessor', () => {
  beforeEach(() => logger.configure({ logImpl: () => null })) // noop by default

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
    }).then(done, done)
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
    }).then(null, err => {
      assert.equal(err.message, 'ExtensionUri is a required string argument')
    }).then(done, done)
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
    }).then(done, done)
  })

  it('should properly audit every event initiation and termination', (done) => {
    factory.RequestProcessor.configure({
      requestImpl: {
        post: (calledUri, options, cb) => {
          const response = { calledUri, options }
          return cb(null, response)
        }
      }
    })

    const logImpl = sinon.spy(message => {
      assert.ok(typeof message === 'string')
      assert.ok(/\[LOG\]/.test(message))
    })

    logger.configure({
      logImpl: logImpl
    })

    const instance = factory.RequestProcessor.create()

    const testUri = 'testUri/sample'
    const testResource = 'test/group/name'
    const testAuthKey = 'testAuthKeyabc123456789'
    const testAccessToken = 'testAccessTokenabc123456789'

    instance.start({
      extensionUri: testUri,
      resources: testResource,
      authKey: testAuthKey,
      accessToken: testAccessToken
    }).then(res => {
      assert.ok(typeof res === 'object')
      assert.ok(logImpl.called)
    }, err => {
      assert.fail(`Should not receive err ${err.message}`)
    }).then(done, done)
  })
})
