const Random = require('random-js')
const random = new Random(Random.engines.browserCrypto)
const Scheduler = require('azure-arm-scheduler')
const randString = require('crypto-random-string')

exports.calcSeconds = function (timestamp) {
  var stamp = timestamp.split(':')
  return 3600 * stamp[0] + 60 * stamp[1]
}

exports.calcRandomSecond = function (startTime, endTime) {
  return random.integer(startTime, endTime)
}

exports.dayShortToLong = function (inputDays) {
  var days = []
  for (var i = 0; i < inputDays.length; i++) {
    var whatDay = inputDays[i].toUpperCase()
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
    // what if user puts in garbage?
  }
  return days
}

exports.randomNextDay = function (inputDays) {
  var dayArray = this.dayShortToLong(inputDays)
  var randDay = random.integer(0, dayArray.length - 1)
  return 'next ' + dayArray[randDay]
}

exports.schedule = function (asyncAuthProvider, subscriptionId, resourceGroupName, jobCollection, extensionName, extensionURI, startTime) {
  let client = new Scheduler(asyncAuthProvider,
    subscriptionId
  )
  return client.jobs.createOrUpdate(
    resourceGroupName,
    jobCollection,
    extensionName + '_' + randString(8),
    {
      properties: {
        action: {
          type: 'Https',
          request: {
            method: 'POST',
            uri: extensionURI
          }
        },
        startTime: startTime
      }
    }
  )
}
