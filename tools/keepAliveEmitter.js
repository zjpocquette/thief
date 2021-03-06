// Heroku will terminate connections that are idle for 30s. See:
// https://devcenter.heroku.com/articles/request-timeout
// This module wraps the EventEmitter and will keep the connection alive
// by emitting a 'Still working' event if no events go out for a few seconds.

const EventEmitter = require('events')

module.exports = class KeepAliveEmitter extends EventEmitter {
  constructor (delay = 8000, message = 'Still working...') {
    super()
    this.delay = delay
    this.message = message
    this.timeout = null
    this.on('progress', this.restartTimer)
    this.on('error', this.cancelTimer)
    this.on('done', this.cancelTimer)
  }

  restartTimer () {
    this.cancelTimer()
    this.timeout = setTimeout(this.ping.bind(this), this.delay)
  }

  cancelTimer () {
    if (this.timeout) clearTimeout(this.timeout)
  }

  ping () {
    this.emit('progress', { message: this.message })
  }
}
