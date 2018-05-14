const assert = require('assert')
const factory = require('../').factory
const fakeFs = require('memfs')

/* eslint-env node, mocha */

describe('List', () => {
  it('should populate an accurate list of extensions', (done) => {
    fakeFs.vol.reset()
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
          var soughtExtension = seekExtension('testExtension1', 'testUri1', 'testDesc1', array)
          assert.equal(array[0], soughtExtension)
        }).then(done, done)
    })
  })
})

function seekExtension (name, uri, desc, extensions) {
  for (var i = 0, l = extensions.length; i < l; i++) {
    if (extensions[i]._name === name && extensions[i]._uri === uri && extensions[i]._desc === desc) {
      return extensions[i]
    }
  }
}
