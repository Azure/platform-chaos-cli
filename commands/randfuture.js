const factory = require('../lib/factory')
const logger = require('../lib/logger')
const moment = require('moment')
const randSched = require('../lib/random-schedule')

exports.command = 'randfuture <extension> <resources>'

exports.describe = 'starts some chaos at a random point in the next month\nNB: there are no time window contraints, can be anytime in a 24 hour period'

exports.builder = {
  extension: {
    description: 'the name of the extension',
    required: true
  },
  resources: {
    description: 'the resources (see `chaos resgen`)',
    required: true
  }
}

exports.handler = (argv) => {
  const authenticator = factory.AzureAuthenticator.create()
  const registry = factory.ExtensionRegistry.create()

  const asyncAuthProvider = argv.accessToken ? Promise.resolve(argv.accessToken) : authenticator.interactive()

  var secondsInterval = randSched.calcRandomSecond(1, 2638000)
  var scheduledTime = moment().add(secondsInterval, 'seconds')

  var resources = argv.resources.split('/')
  var subscriptionId = resources[0]
  var resourceGroupName = resources[1]
  var jobCollection = resources[2]

  return registry
    .get({extensionName: argv.extension})
    .then((ext) => {
      return asyncAuthProvider
        .then(asyncAuthProvider => {
          return randSched.schedule(
            asyncAuthProvider,
            subscriptionId,
            resourceGroupName,
            jobCollection,
            argv.extension,
            ext.uri,
            moment(scheduledTime).toISOString()
          )
        })
    })
    .then((res) => {
      var response = res.properties.state === 'enabled' ? 'Successfully scheduled' : 'Attempted scheduling failed'
      console.log(response)
    })
    .catch(error => {
      console.log('An error occurred:')
      console.dir(error, {depth: null, colors: true})
    })
    .then(logger.info.bind(logger), logger.error.bind(logger))
}
