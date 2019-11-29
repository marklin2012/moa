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

const delay = () => Promise.resolve(resolve => setTimeout(() => resolve()
  , 2000));
app.use(async (ctx, next) => {
  ctx.body = "1";
  await next();
  ctx.body += "5";
});
app.use(async (ctx, next) => {
  ctx.body += "2";
  await delay();
  await next();
  ctx.body += "4";
});
app.use(async (ctx, next) => {
  ctx.body += "3";
});

app.listen(3000, () => {
  console.log('server started at port 3000')
})