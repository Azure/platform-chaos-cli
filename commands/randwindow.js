const factory = require('../lib/factory')
var moment = require('moment')
var Random = require('random-js')
require('../node_modules/datejs/index.js')
// var scheduler = require('azure-arm-scheduler')

var random = new Random(Random.engines.browserCrypto)

// exports.command = 'randwindow <extension> [days] [open] [close]'
exports.command = 'randwindow <extension> [days] [open] [close]'

exports.describe = 'schedule an upcoming time window to schedule some chaos'

exports.builder = {
    extension: {
        description: 'the name of the extension to start',
        type: 'string',
        required: false
    },
    days: {
        description: 'a formatted string with the selected days of the week \nusing MTWRFSU (R for Thur, U for Sun)',
        type: 'string',
        required: false
    },
    open: {
        description: 'the first moment when window of eligible \nrandom time should start (in 24hr time, ie 8:30)',
        type: 'string',
        required: false
    },
    close: {
        description: 'the final moment when window of eligible \nrandom time should end (in 24hr time, ie 16:00)',
        type: 'string',
        required: false
    }
}

exports.handler = (argv) => {
    // const logger = factory.Logger.create()

    const parts = [
        argv.extension,
        argv.days,
        argv.open,
        argv.close
    ]

    //daysWindow = argv.days.split('')

    console.log(argv.days)
    inputDays = argv.days.split('')
    var days = []
    for (i = 0; i < inputDays.length; i++) {
        var whatDay = inputDays[i]
        switch (whatDay) {
            case 'M':
                days[i] = 'Monday'
                break
            case 'T':
                days[i] = 'Tuesday'
                break
            case 'W':
                days[i] = 'Wednesday'
                break
            case 'R':
                days[i] = 'Thursday'
                break
            case 'F':
                days[i] = 'Friday'
                break
            case 'S':
                days[i] = 'Saturday'
                break
            case 'U':
                days[i] = 'Sunday'
                break
        }
    }
    var randDay = random.integer(0, days.length-1)
    console.log('random day', randDay)
    var upcomingDay = 'next ' + days[randDay]
    console.log(upcomingDay)
    var upcomingDate = moment(Date.parse(upcomingDay))
    console.log('Moment says upcoming day is', upcomingDate)

    opentime = argv.open
    openTimeArray = opentime.split(':')
    startSeconds = 3600*openTimeArray[0] + 60*openTimeArray[1]

    closetime = argv.close
    closeTimeArray = closetime.split(':')
    closeSeconds = 3600*closeTimeArray[0] + 60*closeTimeArray[1]
    randTime = random.integer(startSeconds, closeSeconds)

    console.log('random time in seconds', randTime)
    console.log('Random in a time window', moment(upcomingDate).add(randTime, 'seconds'))

}
