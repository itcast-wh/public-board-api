import path from 'path'

const DB_URL = 'mongodb://localhost:27017/board'
const secret = 'FvHbS5syynGTVegdfD8Vt2774ErM7Nsy'

const uploadPath =
  process.env.NODE_ENV !== 'production'
    ? path.join(path.resolve(__dirname), '../../public')
    : '/app/public'

const publicPath = [/^\/public/, /\/login/]

const REDIS = {
  host: 'localhost',
  port: 6379
}

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://www.yourdomain.com'
    : 'http://localhost:8080'

export default {
  DB_URL,
  REDIS,
  secret,
  publicPath,
  uploadPath,
  baseUrl
}
