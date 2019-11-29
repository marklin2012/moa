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

// fn3(fn2(fn1()))

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