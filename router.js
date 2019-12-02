
class Router {
  constructor() {
    this.stacks = []
  }

  register(path, method, middleware) {
    this.stacks.push({
      path, method, middleware
    })
  }

  get(path, middleware) {
    this.register(path, 'get', middleware)
  }

  post(path, middleware) {
    this.register(path, 'post', middleware)
  }

  routes() {
    return async (ctx, next) => {
      let url = ctx.url === '/index' ? '/' : ctx.url
      let method = ctx.method
      let route
      for (let i = 0; i < this.stacks.length; i++) {
        let item = this.stacks[i]
        if (item.path === url && item.method === method) {
          route = item.middleware
          break
        }
      }

      if (typeof route === 'function') {
        await route(ctx, next)
        return
      }

      await next()
    }
  }
}

module.exports = Router