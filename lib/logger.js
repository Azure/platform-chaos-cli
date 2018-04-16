const chalk = require('chalk')
const log = console.log

module.exports = class Logger {
  constructor ({logImpl}) {
    this._logImpl = logImpl || log
  }

  info (...params) {
    params.unshift('[INFO]')
    this._logImpl(this, chalk.white.bgBlue.apply(this, params))
  }

  error (...params) {
    params.unshift('[ERROR]')
    this._logImpl(this, chalk.red.apply(this, params))
  }

  debug (...params) {
    params.unshift('[DEBUG]')
    this._logImpl(this, chalk.red.apply(this, params))
  }

  log (...params) {
    params.unshift('[LOG]')
    this._logImpl(this, chalk.yellow.apply(this, params))
  }

  raw (...params) {
    this._logImpl.apply(this, params)
  }
}
