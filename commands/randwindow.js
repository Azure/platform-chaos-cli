const factory = require('../lib/factory')
const logger = require('../lib/logger')
var moment = require('moment')
require('../node_modules/datejs/index.js')
const randSched = require('../lib/random-schedule')

exports.command = 'randwindow <extension> <resources> [days] [open] [close]'

exports.describe = 'schedule an upcoming time window to schedule some chaos'

exports.builder = {
  extension: {
    description: 'the name of the extension to start',
    type: 'string',
    required: false
  },
  resources: {
    description: 'the resources (see `chaos resgen`)',
    required: true
  },
  days: {
    description: 'a formatted string with the selected days of the week \nusing MTWRFSU (R for Thur, U for Sun)',
    type: 'string',
    required: false
  },
  open: {
    description: 'the first moment when window of eligible random time should start \n(in 24hr time, ie 8:30)',
    type: 'string',
    required: false
  },
  close: {
    description: 'the final moment when window of eligible random time should end \n(in 24hr time, ie 16:00)',
    type: 'string',
    required: false
  }
}

exports.handler = (argv) => {
  const authenticator = factory.AzureAuthenticator.create()
  const registry = factory.ExtensionRegistry.create()

  const asyncAuthProvider = argv.accessToken ? Promise.resolve(argv.accessToken) : authenticator.interactiveCredentials()

  var inputDays = argv.days.split('')
  var upcomingDay = randSched.randomNextDay(inputDays)
  var upcomingDate = moment(Date.parse(upcomingDay))

  var opentime = argv.open
  var startSeconds = randSched.calcSeconds(opentime)

  var closetime = argv.close
  var closeSeconds = randSched.calcSeconds(closetime)
  var randTime = randSched.calcRandomSecond(startSeconds, closeSeconds)
  var upcomingMoment = moment(upcomingDate).add(randTime, 'seconds')

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
            moment(upcomingMoment).toISOString()
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
