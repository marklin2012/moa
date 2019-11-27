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

app.use(ctx => {
  ctx.body = 'Cool, Moa'
})

app.listen(3000, () => {
  console.log('server started at port 3000')
})