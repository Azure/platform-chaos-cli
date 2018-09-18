const factory = require('../lib/factory')
const logger = require('../lib/logger')
var moment = require('moment')
var scheduler = require('azure-arm-scheduler')
require('../lib/random-schedule')
const randSched = require('../lib/random-schedule')

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

    secondsInterval = randSched.calcRandomSecond(1, 2638000)
    scheduledTime = moment().add(secondsInterval, 'seconds')
    console.log('Random point within in a month:', scheduledTime)
}

// // upper bound of randomly generated time ? like 1 month? 2628000
