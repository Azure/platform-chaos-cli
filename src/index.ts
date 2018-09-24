export default {
  AzureAuthenticator: require('./lib/azure-authenticator'),
  Extension: require('./lib/extension'),
  ExtensionRegistry: require('./lib/extension-registry'),
  Logger: require('./lib/logger'),
  RequestProcessor: require('./lib/request-processor'),
  factory: require('./lib/factory'),
  list: require('./commands/list').handler,
  register: require('./commands/register').handler,
  resgen: require('./commands/resgen').handler,
  start: require('./commands/start').handler,
  stop: require('./commands/stop').handler,
  token: require('./commands/token').handler,
  unregister: require('./commands/unregister').handler
}
