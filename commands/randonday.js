const factory = require('../lib/factory')
var moment = require('moment')
// var Random = require('random-js')
var scheduler = require('azure-arm-scheduler')
var msRestAzure = require('ms-rest-azure')
const randSched = require('../lib/random-schedule')

// var random = new Random(Random.engines.browserCrypto)

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
    const rp = factory.RequestProcessor.create()

    const asyncAuthProvider = argv.accessToken ? Promise.resolve(argv.accessToken) : authenticator.interactive()

    const parts = [
        argv.extension,
        argv.date,
        argv.open,
        argv.close, 
        argv.accessToken
    ]

    startdate = moment(parts[1])
    starttime = parts[2] !== undefined ? parts[2] : '0:00' 
    // startTimeArray = starttime.split(':')
    // startSeconds = 3600*startTimeArray[0] + 60*startTimeArray[1]
    startSeconds = randSched.calcSeconds(starttime)
    starttime = startdate.add(startSeconds, 'seconds').unix().valueOf()
    console.log('startdate unix', starttime)

    endDate = moment(parts[1])
    endTime = parts[3] !== undefined ? parts[3] : '23:59'
    // endSeconds = 3600*endTime[0] + 60*endTime[1]
    endSeconds = randSched.calcSeconds(endTime)
    endTime = endDate.add(endSeconds, 'seconds').unix().valueOf()
    console.log('endtime unix', endTime)

    // randtime = random.integer(starttime, endTime)
    randtime = randSched.calcRandomSecond(starttime, endTime)
    console.log('random time in secs', randtime)
    console.log('ISO Format => ', moment(moment.unix(randtime)).toISOString())
    
    //create a scheduled job needs: 
    //   time as ISO
    //   job to run

    return registry
        .get({extensionName: parts[1]})
        .then((ext) => {
            console.log('poop')
        })
    // msRestAzure.interactiveLogin().then(credentials => {
    //     // Create a scheduler from the login credentials
    //     let client = new SchedulerManagement(credentials, 'your-subscription-id')
    //     // Get the full list of current jobs for the subscription
    //     jobScheduler = new jobOperations(client)
    //     jobScheduler.create(
    //         //parameters:
    //         {
    //             startTime: moment(moment.unix(randtime)).toISOString(),
    //             action: {
    //                 type: 'https',
    //                 retryPolicy:,
    //                 errorAction:,
    //                 request: {
    //                     uri:'',
    //                     method:'',
    //                     auhentication:'',
    //                     headers: '',
    //                     body: ''
    //                 },
    //                 queueMessage:
    //             }
    //         },
    //         //callback
    //         {}
    //     )
    // }).then(currentJobs => {
    //     console.log("Current jobs:")
    //     console.dir(currentJobs, {depth:null, colors:true})
    // }).catch(error => {
    //     console.log("An error occurred:")
    //     console.dir(error, {depth:null, colors:true})
    // })

}
