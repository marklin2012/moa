// const http = require('http')
// const server = http.createServer((req, res) => {
//   res.writeHead(200)
//   res.end('hello nodejs')
// })

// server.listen(3000, () => {
//   console.log('server started at port 3000')
// })

const Moa = require('./moa')
const app = new Moa()

// app.use((req, res) => {
//   res.writeHeader(200)
//   res.end('hello, Moa')
// })

// app.use(ctx => {
//   ctx.body = 'Cool, Moa'
// })

// const delay = () => new Promise(resolve => setTimeout(() => resolve()
//   , 2000))
// app.use(async (ctx, next) => {
//   ctx.body = "1"
//   await next()
//   ctx.body += "5"
// })
// app.use(async (ctx, next) => {
//   ctx.body += "2"
//   await delay()
//   await next()
//   ctx.body += "4"
// })
// app.use(async (ctx, next) => {
//   ctx.body += "3"
// })

const Router = require('./router')
const router = new Router()

router.get('/', async ctx => { ctx.body = 'index page' })
router.get('/home', async ctx => { ctx.body = 'home page' })
router.post('/', async ctx => { ctx.body = 'post index' })

app.use(router.routes())

app.listen(3000, () => {
  console.log('server started at port 3000')
})