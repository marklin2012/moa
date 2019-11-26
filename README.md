# Moa
a demo for learning Koa

### 传统 nodejs 使用方法
```
const http = require('http')
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end = 'hello nodejs'
})

server.listen(3000, () => {
  console.log('server started at port 3000')
})
```