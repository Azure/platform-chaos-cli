const factory = require('../lib/factory')
const logger = require('../lib/logger')
var moment = require('moment')
require('../node_modules/datejs/index.js')
// var scheduler = require('azure-arm-scheduler')
const randSched = require('../lib/random-schedule')


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

    const parts = [
        argv.extension,
        argv.days,
        argv.open,
        argv.close
    ]

    inputDays = parts[1].split('')
    upcomingDay = randSched.randomNextDay(inputDays)
    var upcomingDate = moment(Date.parse(upcomingDay))

    opentime = parts[2]
    startSeconds = randSched.calcSeconds(opentime)

    closetime = parts[3]
    closeSeconds = randSched.calcSeconds(closetime)
    randTime = randSched.calcRandomSecond(startSeconds, closeSeconds)

    console.log('random time in seconds', randTime)
    console.log('Random in a time window', moment(upcomingDate).add(randTime, 'seconds'))

}

