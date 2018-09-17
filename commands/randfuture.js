const factory = require('../lib/factory')
var moment = require('moment')
// var Random = require('random-js')
var scheduler = require('azure-arm-scheduler')
require('../lib/random-schedule')

// var random = new Random(Random.engines.browserCrypto)

exports.command = 'randfuture <extension>'

exports.describe = 'starts some chaos at a random point in the next month\nNB: there are no time window contraints, can be anytime in a 24 hour period'

exports.builder = {
    extension: {
        description: 'the name of the extension'
    }
}

exports.handler = (argv) => {
    // const authenticator = factory.AzureAuthenticator.create()
    // const registry = factory.ExtensionRegistry.create()
    // const rp = factory.RequestProcessor.create()

    // const asyncAuthProvider = argv.accessToken ? Promise.resolve(argv.accessToken) : authenticator.interactive()
    // // var client = new SchedulerClient

    // secondsInterval = random.integer(1, 2638000)
    secondsInterval = calcRandomSecond(1, 2638000)
    scheduledTime = moment().add(secondsInterval, 'seconds')
    console.log('Random point within in a month:', scheduledTime)
}

// // upper bound of randomly generated time ? like 1 month? 2628000
