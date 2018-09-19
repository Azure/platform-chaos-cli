const factory = require('../lib/factory')
const logger = require('../lib/logger')

exports.command = 'resgen <subId> [resGroup] [resName]'

exports.describe = 'create a properly formatted resource identifier'

exports.builder = {
  subId: {
    desc: 'the azure subscription id'
  },
  resGroup: {
    desc: 'the azure resource group name'
  },
  resName: {
    desc: 'the azure resource name'
  }
}

exports.handler = (argv) => {

  const parts = [
    argv.subId,
    argv.resGroup,
    argv.resName
  ]

  return logger.raw(parts.filter(p => p).join('/'))
}
