import * as assert from 'assert'
import * as sinon from 'sinon'

import index from '../'
import logger from '../lib/logger'

const factory = index.factory
// const factory = require('../').factory
// const logger = require('../lib/logger')

/* eslint-env node, mocha */

describe('RequestProcessor', () => {
  beforeEach(() => logger.configure({ logImpl: () => null })) // noop by default

  it('should successfully transform an extension uri', (done) => {
    factory.RequestProcessor.configure({
      requestImpl: {
        post: (calledUri, options, cb) => {
          const response = { calledUri, options }
          return cb(null, response)
        }
      }
    })

    const instance = factory.RequestProcessor.create()
    const testUri = 'testUri/sample'

    instance.start({
      accessToken: 'testAccessToken',
      authKey: 'testAuthKey',
      extensionUri: testUri,
      resources: 'test/samplegroup/sampleresourceid'
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
          const response = { calledUri, options }
          return cb(null, response)
        }
      }
    })

    const instance = factory.RequestProcessor.create()
    const testObject = {
      expectedAccessToken: 'testAccessToken',
      expectedAuthKey: 'testAuthKey',
      expectedExtensionUri: null,
      expectedResources: 'test/samplegroup/sampleresourceid'
    }

    instance.start({
      accessToken: testObject.expectedAccessToken,
      authKey: testObject.expectedAuthKey,
      extensionUri: testObject.expectedExtensionUri,
      resources: testObject.expectedResources
    }).then(null, (err) => {
      assert.equal(err.message, 'ExtensionUri is a required string argument')
    }).then(done, done)
  })

  it('should handle a backslash passed in an extension uri', (done) => {
    factory.RequestProcessor.configure({
      requestImpl: {
        post: (calledUri, options, cb) => {
          const response = { calledUri, options }
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
      accessToken: testAccessToken,
      authKey: testAuthKey,
      extensionUri: testUri,
      resources: testResource
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

    const logImpl = sinon.spy((message) => {
      assert.ok(typeof message === 'string')
      assert.ok(/\[LOG\]/.test(message))
    })

    logger.configure({
      logImpl
    })

    const instance = factory.RequestProcessor.create()

    const testUri = 'testUri/sample'
    const testResource = 'test/group/name'
    const testAuthKey = 'testAuthKeyabc123456789'
    const testAccessToken = 'testAccessTokenabc123456789'

    instance.start({
      accessToken: testAccessToken,
      authKey: testAuthKey,
      extensionUri: testUri,
      resources: testResource
    }).then((res) => {
      assert.ok(typeof res === 'object')
      assert.ok(logImpl.called)
    }, (err) => {
      assert.fail(`Should not receive err ${err.message}`)
    }).then(done, done)
  })
})
