# Moa
a demo for learning Koa

### Koa 原理
一个 *nodejs* 的入门级 *http* 服务代码如下，
```js
// index.js
const http = require('http')
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('hello nodejs')
})

server.listen(3000, () => {
  console.log('server started at port 3000')
})
```

*koa* 的目标是更简单化、流程化、模块化的方式实现回调，我们希望可以参照 *koa* 用如下方式来实现代码：

```js
// index.js
const Moa = require('./moa')
const app = new Moa()

app.use((req, res) => {
  res.writeHeader(200)
  res.end('hello, Moa')
})

app.listen(3000, () => {
  console.log('server started at port 3000')
})
```

所以我们需要创建一个 `moa.js` 文件，该文件主要内容是创建一个类 *Moa*， 主要包含 `use()` 和 `listen()` 两个方法

```js
// 创建 moa.js
const http = require('http')

class Moa {

  use(callback) {
    this.callback = callback
  }

  listen(...args) {
    const server = http.createServer((req, res) => {
      this.callback(req, res)
    })

    server.listen(...args)
  }
}

module.exports = Moa
```
### Context

*koa* 为了能够简化 API，引入了上下文 *context* 的概念，将原始的请求对象 *req* 和响应对象 *res* 封装并挂载到了 *context* 上，并且设置了 *getter* 和 *setter* ，从而简化操作

```js
// index.js
// ...

// app.use((req, res) => {
//   res.writeHeader(200)
//   res.end('hello, Moa')
// })

app.use(ctx => {
  ctx.body = 'cool moa'
})

// ...
```

为了达到上面代码的效果，我们需要分装 3 个类，分别是 `context`, `request`, `response` , 同时分别创建上述 3 个 js 文件，

```js
// request.js
module.exports = {
  get url() {
    return this.req.url
  }
  get method() {
    return this.req.method.toLowerCase()
  }
}

// response.js
module.exports = {
  get body() {
    return this._body
  }

  set body(val) = {
    this._body = val
  }
}

// context.js
module.exports = {
  get url() {
    return this.request.url
  }
  get body() = {
    return this.response.body
  }
  set body(val) {
    this.response.body = val
  }
  get method() {
    return this.request.method
  }
}
```

接着我们需要给 *Moa* 这个类添加一个 `createContext(req, res)` 的方法：

```js
// moa.js
const http = require('http')

const context = require('./context')
const request = require('./request')
const response = require('./response')

class Moa {
  // ...
  createContext(req, res) {
    const ctx = Object.create(context)
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)

    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
  }
}

```