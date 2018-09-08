const factory = require('../lib/factory')

exports.command = 'randwindow <extension> <days> [days] <open> [hour] close [hour]'

exports.describe = 'schedule an upcoming time window to schedule some chaos'

exports.builder = {
    extension: {
        description: 'the name of the extension to start'
    },
}

//extension - kind of chaos to run?
//days - M T W R F Sa Su
//open - use 24 hour time, and then separate hour and minutes with an h?