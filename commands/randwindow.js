const factory = require('../lib/factory')

exports.command = 'randwindow <extension> [days] [open] [close]'

exports.describe = 'schedule an upcoming time window to schedule some chaos'

exports.builder = {
    extension: {
        description: 'the name of the extension to start',
        type: 'string',
        required: false
    },
    days: {
        description: 'a formatted string with the selected days of the week, ie MWF',
        type: 'string',
        required: false
    },
    open: {
        description: 'a formatted string of first moment when chaos window should start, ie 8:30',
        type: 'string',
        required: false
    },
    close: {
        description: 'a formatted string of final moment when chaos window should be open, ie 16:00',
        type: 'string',
        required: false
    }
}

exports.handler = (argv) => {
    const logger = factory.Logger.create()

    const parts = [
        argv.extension,
        argv.days,
        argv.open,
        argv.close
    ]
    // opentime = argv.open.split('h') // creates an array
    // closetime = argv.close.split('h') // creates an array for close
}

//extension - kind of chaos to run?
//days - M T W R F Sa Su ; get today, then nearest selected days after
//open - use 24 hour time, and then separate hour and minutes with an h?
//close - ditto