
class Router {
  constructor() {
    this.stacks = []
  }
  get(path, callback) {
    const route = {
      path,
      method: 'get',
      route: callback
    }
    this.stacks.push(route)
  }

  routes() {
    return async (ctx, next) => {
      let url = ctx.url === '/index' ? '/' : ctx.url
      let method = ctx.method
      console.log('method:', ctx.method, method)
      let route
      for (let i = 0; i < this.stacks.length; i++) {
        let item = this.stacks[i]
        if (item.path === url && item.method === method) {
          route = item.route
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