const chalk = require('chalk')
const log = console.log

module.exports = class Logger {
  constructor ({logImpl}) {
    this._logImpl = logImpl || log
  }

  info (...params) {
    params.unshift('[INFO]')
    this._logImpl(chalk.white.bgBlue(...params))
  }

  error (...params) {
    params.unshift('[ERROR]')
    this._logImpl(chalk.red(...params))
  }

  debug (...params) {
    params.unshift('[DEBUG]')
    this._logImpl(chalk.red(...params))
  }

  log (...params) {
    params.unshift('[LOG]')
    this._logImpl(chalk.yellow(...params))
  }

  raw (...params) {
    this._logImpl(...params)
  }
}
