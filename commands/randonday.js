const factory = require('../lib/factory')
var moment = require('moment')
var Random = require('random-js')
var scheduler = require('azure-arm-scheduler')

var random = new Random(Random.engines.browserCrypto)

exports.command = 'randonday <extension> [date] [open] [close]'

exports.describe = 'starts some chaos at a random point on specified day\nNB: there are no time window contraints, can be anytime in a 24 hour period'

exports.builder = {
    extension: {
        description: 'the name of the extension'
    },
    date: {
        description: 'the specified date, formatted like YYYY-MM-DD',
        type: 'string',
        required: true
    },
    open: {
        description: 'the starting hour of a specified time window, in 24hr format (ie 8:00)',
        type: 'string',
        required: true
    },
    close: {
        description: 'the final hour of a specified time window, in 24hr format (ie 17:00)',
        type: 'string',
        required: true
    }
}

exports.handler = (argv) => {
    // const authenticator = factory.AzureAuthenticator.create()
    // const registry = factory.ExtensionRegistry.create()
    // const rp = factory.RequestProcessor.create()

    // const asyncAuthProvider = argv.accessToken ? Promise.resolve(argv.accessToken) : authenticator.interactive()
    // // var client = new SchedulerClient

    const parts = [
        argv.extension,
        argv.date,
        argv.open,
        argv.close
    ]

    startdate = moment(argv.date)
    console.log('start date', startdate)
    startTime = argv.open
    console.log('start time', startTime)
    startTimeArray = startTime.split(':')
    startSeconds = 3600*startTimeArray[0] + 60*startTimeArray[1]
    startTime = startdate.add(startSeconds, 'seconds').unix().valueOf()
    console.log('startdate unix', startTime)

    endDate = moment(argv.date)
    endtime = argv.close.split(':')
    console.log('startdate ->', startdate)
    console.log('end date ->', endDate)
    endSeconds = 3600*endtime[0] + 60*endtime[1]
    endTime = endDate.add(endSeconds, 'seconds').unix().valueOf()
    console.log('endtime unix', endTime)

    randtime = random.integer(startTime, endTime)
    console.log('random time in secs', randtime)
    console.log('formated time', moment.unix(randtime))

}

// // upper bound of randomly generated time ? like 1 month? 2628000
