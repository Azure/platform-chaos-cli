const assert = require('assert')
const fakeFs = require('memfs')
const factory = require('../').factory

/* eslint-env node, mocha */
const testName = 'testExtension'
const testUri = 'testUri'
const testDesc = 'testDesc'

describe('List', () => {
  beforeEach(function () {
    fakeFs.vol.reset()
  })
  it('should properly register an extension', (done) => {
    factory.ExtensionRegistry.configure({
      fsLocation: '/temp',
      fsImpl: fakeFs
    })
    const instance = factory.ExtensionRegistry.create()

    instance.register({
      extensionName: testName,
      extensionUri: testUri,
      extensionDesc: testDesc
    }).then(() => {
      return instance.get({extensionName: testName})
    })
      .then(match => {
        assert.equal(match.name, testName)
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
      extensionName: testName,
      extensionUri: testUri,
      extensionDesc: testDesc
    }).then(() => {
      instance.unregister({
        extensionName: testName
      })
    }).then(() => {
      assert.equal(instance.getAll.length, 0)
    }).then(done, done)
  })

  it('should populate an accurate list of extensions', (done) => {
    factory.ExtensionRegistry.configure({
      fsLocation: '/temp',
      fsImpl: fakeFs
    })
    const instance = factory.ExtensionRegistry.create()
    const secondTestName = 'testExtension2'
    const secondTestUri = 'testUri2'
    const secondTestDesc = 'testDesc2'

    instance.register({
      extensionName: testName,
      extensionUri: testUri,
      extensionDesc: testDesc
    }).then(() => {
      return instance.register({
        extensionName: secondTestName,
        extensionUri: secondTestUri,
        extensionDesc: secondTestDesc})
    }).then(() => {
      return instance.getAll()
    })
      .then(array => {
        assert.equal(array.length, 2)
        var index = array.map(e => e._name).indexOf(testName)
        var soughtExtension = array[index]
        assert.equal(array[0], soughtExtension)
      }).then(done, done)
  })
})
