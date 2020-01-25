import Koa from 'koa'
import JWT from 'koa-jwt'
import compose from 'koa-compose'
import compress from 'koa-compress'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import errorHandle from './common/ErrorHandle'
import config from './config/index'
import koaBody from 'koa-body'
import staticFile from 'koa-static'
import routes from './routes/index'
import AuthGuard from './common/AuthGuard'

const app = new Koa()

const isDevMode = !(
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
)

const jwt = JWT({ secret: config.secret }).unless({
  path: config.publicPath
})

const middleware = compose([
  koaBody({
    multipart: true, // 支持文件上传
    encoding: 'utf-8',
    formidable: {
      // uploadDir: path.join(__dirname,'public/upload/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 10 * 1024 * 1024, // 文件上传大小
      onFileBegin: async (name, file) => {
        // 文件上传前的设置
        console.log(`name: ${name}`)
        console.log(file)
      }
    },
    onError: err => {
      console.log(err)
    }
  }),
  staticFile(config.uploadPath),
  cors(),
  helmet(),
  errorHandle,
  jwt,
  AuthGuard,
  routes()
])

if (!isDevMode) {
  app.use(compress())
}

app.use(middleware)

const port = !isDevMode ? 5000 : 3000

console.log('port is:' + port)

app.listen(port, () => {
  console.log(`The server is running localhost:${port}/`)
})
