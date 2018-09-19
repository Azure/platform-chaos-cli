const factory = require('../lib/factory')
const logger = require('../lib/logger')

exports.command = 'register <name> <uri> [desc]'

exports.describe = 'register a chaos extension'

exports.builder = {
  name: {
    description: 'the unique name of the extension'
  },
  uri: {
    description: 'the extension uri'
  },
  desc: {
    description: 'the brief extension description'
  }
}

exports.handler = (argv) => {
  const registry = factory.ExtensionRegistry.create()

  return registry
    .register({
      extensionName: argv.name,
      extensionUri: argv.uri,
      extensionDesc: argv.desc
    })
    .then(logger.info.bind(logger), logger.error.bind(logger))
}
