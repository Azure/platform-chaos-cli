const Scheduler = require('azure-arm-scheduler')
const randString = require('crypto-random-string')

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
