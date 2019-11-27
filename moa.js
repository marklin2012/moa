const http = require('http')

const context = require('./context')
const request = require('./request')
const response = require('./response')

class Moa {
  use(callback) {
    this.callback = callback
  }
  listen(...args) {
    const server = http.createServer((req, res) => {
      // 创建上下文
      const ctx = this.createContext(req, res)
      this.callback(ctx)
      // 响应
      res.end(ctx.body)
    })

    server.listen(...args)
  }

  createContext(req, res) {
    const ctx = Object.create(context)
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)

    ctx.req = ctx.request = req
    ctx.res = ctx.response = res
    return ctx
  }
}

module.exports = Moa