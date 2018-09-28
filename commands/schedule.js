const factory = require('../lib/factory')
const logger = require('../lib/logger')
const moment = require('moment')
const uuid = require('uuid/v4')
const momentRandom = require('moment-random')
const randSched = require('../lib/random-schedule')

exports.command = 'schedule'

exports.describe = 'schedule chaos within time constraints'

exports.builder = {
  type: {
    description: `the type of scheduling constraint ('daily', 'onetime')`,
    type: 'string',
    required: true
  },
  name: {
    description: 'the unique name of the extension',
    type: 'string',
    required: true
  },
  scheduler: {
    description: `target scheduler resource id in the form of subscription/resourceGroup/resourceId`,
    type: 'string',
    required: true
  },
  resources: {
    description: `target resource ids in the form of subscription/resourceGroup/resourceId`,
    type: 'string',
    required: true
  },
  accessToken: {
    description: `short-lived access token that allows us to schedule (will be prompted if not given)`,
    required: false,
    type: 'string'
  },
  days: {
    description: `include specific days in the scheduling constraint window ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')`,
    type: 'array',
    required: false
  },
  date: {
    description: `include a specific date in the scheduling constraint window (YYYY-MM-DD)`,
    type: 'string',
    required: false
  },
  startTime: {
    description: `starting time hh:mm:ss (24 hour format)`,
    type: 'string',
    required: false
  },
  endTime: {
    description: `ending time hh:mm:ss (24 hour format)`,
    type: 'string',
    required: false
  }
}

exports.handler = (argv) => {
  // TODO(bengreenier): alphabetize keys :)

  const { name, date, days, startTime, endTime, resources, scheduler } = argv

  const [schedulerSubId, schedulerResId, schedulerId] = scheduler.split('/')

  // TODO(bengreenier): validate
  const [startHours, startMinutes, startSeconds] = startTime.split(':')
  const [endHours, endMinutes, endSeconds] = endTime.split(':')

  const scheduledTimes =[]

  if (argv.type === 'onetime') {

    // advance into the day, startTime
    const start = moment(date).add({ hours: startHours, minutes: startMinutes, seconds: startSeconds })

    // advance into the day, endTime
    const end = moment(date).add({ hours: endHours, minutes: endMinutes, seconds: endSeconds })

    scheduledTimes.push(momentRandom(end, start))

  } else if (argv.type === 'daily') {

    // for each of the days of the week make a moment
    const times = days.map(day => moment().day(day))
      .map(daysAsMoments => ({
        start: moment(daysAsMoments).add({ hours: startHours, minutes: startMinutes, seconds: startSeconds }),
        end: moment(daysAsMoments).add({ hours: endHours, minutes: endMinutes, seconds: endSeconds })
      })) // will result in array of moment objects
      .map(daysWithFrames => momentRandom(daysWithFrames.end, daysWithFrames.start))

      scheduledTimes.push(...times)
  }

  const authenticator = factory.AzureAuthenticator.create()
  const registry = factory.ExtensionRegistry.create()

  // kickoff async work
  //
  // lookup extension in local registry
  // get authentication token
  // schedule task
  // indicate success via logger
  return registry
    .get({ extensionName: name })
    .then((ext) => {
      const { uri } = ext

      const asyncAuthProvider = argv.accessToken ? Promise.resolve(argv.accessToken) : authenticator.interactive()

      return asyncAuthProvider.then((authState) => {
        return { uri, authState }
      })
    })
    .then((uriAndAuth) => {
      return Promise.all(scheduledTimes.map(time => 
        randSched
          .schedule(uriAndAuth.authState,
            schedulerSubId,
            schedulerResId,
            `default-${schedulerId}`,
            `${name}-${uuid()}`,
            `${uriAndAuth.uri}/?resources=${resources}`,
            time.toISOString())
      ))
    })
    .then((res) => {
      return res.properties.state === 'enabled' ? 'Successfully scheduled' : 'Attempted scheduling failed'
    })
    .then(logger.info.bind(logger), logger.error.bind(logger))
}
