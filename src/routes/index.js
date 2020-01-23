import combineRouters from 'koa-combine-routers'

const moduleFiles = require.context('./modules', true, /\.js/)

const modules = moduleFiles.keys().reduce((items, path) => {
  const value = moduleFiles(path)
  items.push(value.default)
  return items
}, [])

const router = combineRouters(modules)

export default router
