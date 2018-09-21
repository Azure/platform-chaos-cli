const factory = require('../lib/factory')
var moment = require('moment')
const randSched = require('../lib/random-schedule')

exports.command = 'randonday <extension> <resources> [date] [open] [close]'

exports.describe = 'starts some chaos at a random point on specified day\nNB: time window constraints are optional. If none provided, defaults to 24hr period'

exports.builder = {
  extension: {
    description: 'the name of the extension',
    required: true
  },
  resources: {
    description: 'the resources (see `chaos resgen`)',
    required: true
  },
  date: {
    description: 'the specified date, formatted like YYYY-MM-DD',
    type: 'string',
    required: true
  },
  open: {
    description: 'the starting hour of a specified time window, in 24hr format (ie 8:00)\nif left blank defaults to 00:00',
    type: 'string',
    required: false
  },
  close: {
    description: 'the final hour of a specified time window, in 24hr format (ie 17:00)\nif left blank defaults to 23:59',
    type: 'string',
    required: false
  }
}

exports.handler = (argv) => {
  const authenticator = factory.AzureAuthenticator.create()
  const registry = factory.ExtensionRegistry.create()

  const asyncAuthProvider = argv.accessToken ? Promise.resolve(argv.accessToken) : authenticator.interactiveCredentials()

  var startdate = moment(argv.date)
  var starttime = argv.open !== undefined ? argv.open : '0:00'
  var startSeconds = randSched.calcSeconds(starttime)
  starttime = startdate.add(startSeconds, 'seconds').unix().valueOf()

  var endDate = moment(argv.date)
  var endTime = argv.close !== undefined ? argv.close : '23:59'
  var endSeconds = randSched.calcSeconds(endTime)
  endTime = endDate.add(endSeconds, 'seconds').unix().valueOf()

  var randtime = randSched.calcRandomSecond(starttime, endTime)
  console.log('ISO Format => ', moment(moment.unix(randtime)).toISOString())

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
            ext.uri,
            moment(randtime).toISOString())
          // .then() convey success
        })
    })
    .catch(error => {
      console.log('An error occurred:')
      console.dir(error, {depth: null, colors: true})
    })
}
