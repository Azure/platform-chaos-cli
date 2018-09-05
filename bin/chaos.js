#!/usr/bin/env node

const home = require('home')
const yargs = require('yargs')
const factory = require('../lib/factory')
const pkgJson = require('../package.json')
const logger = require('../lib/logger')
// configure the factory for runtime
// this injects our production dependencies
factory.RequestProcessor.configure({
  requestImpl: require('request')
})
factory.ExtensionRegistry.configure({
  fsImpl: require('fs'),
  fsLocation: home.resolve('~/.chaos-extensions.json')
})
logger.configure({
  logImpl: console.log
})
factory.AzureAuthenticator.configure({
  msRestImpl: require('ms-rest-azure')
})

// finally, run the yargs command pipeline or show help
//
// eslint-disable-next-line no-unused-expressions
yargs
  .commandDir('../commands')
  .usage('chaos [command] [args]')
  .version(pkgJson.version)
  .wrap(yargs.terminalWidth())
  .epilog('Learn more @ https://github.com/Azure/platform-chaos-cli')
  .alias('h', 'help')
  .help('h')
  .demandCommand()
  .recommendCommands()
  .argv
