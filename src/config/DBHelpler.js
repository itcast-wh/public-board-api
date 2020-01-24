import mongoose from 'mongoose'
import config from './index'

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// 连接
const init = () => {
  mongoose.connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

// 连接成功
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ', config.DB_URL)
})

// 连接异常
mongoose.connection.on('error', function (err) {
  mongoose.disconnect()
  console.log('Mongoose connection error: ' + err)
})

// 断开连接
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected')
  setTimeout(() => {
    init()
  }, 5000)
})

init()

export default mongoose
