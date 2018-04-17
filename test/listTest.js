const assert = require('assert')
const factory = require('../').factory
const fakeFs = require('memfs')

/* eslint-env node, mocha */

describe('azure-chaos', () => {
  describe('ListTest', () => {
    it('should properly populate a list of registered extensions', (done) => {
      factory.ExtensionRegistry.configure({
        fsLocation: '/temp',
        fsImpl: fakeFs
      })
      const instance = factory.ExtensionRegistry.create()

      instance.register({
        extensionName: 'testExtension1',
        extensionUri: 'testUri1',
        extensionDesc: 'testDesc1'
      }).then(() => {
        instance.register({
          extensionName: 'testExtension2',
          extensionUri: 'testUri2',
          extensionDesc: 'testDesc2'
        }).then(() => {
          return instance.getAll()
        })
          .then(array => {
            assert.equal(array.length, 2)
          }).then(done, done)
      })
    })
  })
})
