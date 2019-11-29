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

接着我们需要给 *Moa* 这个类添加一个 `createContext(req, res)` 的方法, 并在 `listen()` 方法中适当的地方挂载上：

```js
// moa.js
const http = require('http')

const context = require('./context')
const request = require('./request')
const response = require('./response')

class Moa {
  // ...
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

    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
  }
}

```

### 中间件

*Koa* 中间键机制：*Koa* 中间件机制就是函数组合的概念，将一组需要顺序执行的函数复合为一个函数，外层函数的参数实际是内层函数的返回值。洋葱圈模型可以形象表示这种机制，是 `Koa` 源码中的精髓和难点。

![洋葱圈模型](/static/onion.jpeg)


#### 同步函数组合

假设有 3 个同步函数:

```js
// compose_test.js
function fn1() {
  console.log('fn1')
  console.log('fn1 end')
}

function fn2() {
  console.log('fn2')
  console.log('fn2 end')
}

function fn3() {
  console.log('fn3')
  console.log('fn3 end')
}
```

我们如果想把三个函数组合成一个函数且按照顺序来执行，那通常的做法是这样的：

```js
// compose_test.js
// ...
fn3(fn2(fn1()))
```
执行 `node compose_test.js` 输出结果：

```bash
fn1
fn1 end
fn2
fn2 end
fn3
fn3 end
```

当然这不能叫做是函数组合，我们期望的应该是需要一个 `compose()` 方法来帮我们进行函数组合，按如下形式来编写代码：

```js
// compose_test.js
// ...
const middlewares = [fn1, fn2, fn3]
const finalFn = compose(middlewares)
finalFn()
```

让我们来实现一下 `compose()` 函数，
```js
// compose_test.js
// ...
const compose = (middlewares) => () => {
  [first, ...others] = middlewares
  let ret = first()
  others.forEach(fn => {
    ret = fn(ret)
  })
  return ret
}

const middlewares = [fn1, fn2, fn3]
const finalFn = compose(middlewares)
finalFn()
```

可以看到我们最终得到了期望的输出结果：

```bash
fn1
fn1 end
fn2
fn2 end
fn3
fn3 end
```
