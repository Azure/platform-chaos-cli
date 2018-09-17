const factory = require('../lib/factory')
var moment = require('moment')
// var Random = require('random-js')
require('../node_modules/datejs/index.js')
// var scheduler = require('azure-arm-scheduler')
require('../lib/random-schedule')

// var random = new Random(Random.engines.browserCrypto)

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

    inputDays = parts[1].split('')
    // var days = []
    // for (i = 0; i < inputDays.length; i++) {
    //     var whatDay = inputDays[i]
    //     switch (whatDay) {
    //         case 'M':
    //             days[i] = 'Monday'
    //             break
    //         case 'T':
    //             days[i] = 'Tuesday'
    //             break
    //         case 'W':
    //             days[i] = 'Wednesday'
    //             break
    //         case 'R':
    //             days[i] = 'Thursday'
    //             break
    //         case 'F':
    //             days[i] = 'Friday'
    //             break
    //         case 'S':
    //             days[i] = 'Saturday'
    //             break
    //         case 'U':
    //             days[i] = 'Sunday'
    //             break
    //     }
    //     //what if user puts in garbage?
    // }
    // var randDay = random.integer(0, days.length-1)
    // var upcomingDay = 'next ' + days[randDay]
    upcomingDay = randomNextDay(inputDays)
    var upcomingDate = moment(Date.parse(upcomingDay))

    opentime = parts[2]
    // openTimeArray = opentime.split(':')
    // startSeconds = 3600*openTimeArray[0] + 60*openTimeArray[1]
    startSeconds = calcSeconds(opentime)

    closetime = parts[3]
    // closeTimeArray = closetime.split(':')
    // closeSeconds = 3600*closeTimeArray[0] + 60*closeTimeArray[1]
    closeSeconds = calcSeconds(closetime)
    // randTime = random.integer(startSeconds, closeSeconds)
    randTime = calcRandomSecond(startSeconds, closeSeconds)

    console.log('random time in seconds', randTime)
    console.log('Random in a time window', moment(upcomingDate).add(randTime, 'seconds'))

}

