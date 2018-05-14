const assert = require('assert')
const factory = require('../').factory
const fakeFs = require('memfs')

/* eslint-env node, mocha */

describe('ExtensionRegistry', () => {
  it('should properly register an extension', (done) => {
    fakeFs.vol.reset()
    factory.ExtensionRegistry.configure({
      fsLocation: '/temp',
      fsImpl: fakeFs
    })
    const instance = factory.ExtensionRegistry.create()

    instance.register({
      extensionName: 'testExtension',
      extensionUri: 'testUri',
      extensionDesc: 'testDesc'
    }).then(() => {
      return instance.get({extensionName: 'testExtension'})
    })
      .then(match => {
        assert.equal(match.name, 'testExtension')
      })
      .then(done, done)
  })
  it('should properly unregister an extension', (done) => {
    factory.ExtensionRegistry.configure({
      fsLocation: '/temp',
      fsImpl: fakeFs
    })
    const instance = factory.ExtensionRegistry.create()

    instance.register({
      extensionName: 'registeredExtension',
      extensionUri: 'testUri',
      extensionDesc: 'testDesc'
    }).then(() => {
      instance.unregister({
        extensionName: 'registeredExtension'
      })
    }).then(() => {
      assert.equal(instance.getAll.length, 0)
    }).then(done, done)
  })
})
