import mongoose from '../config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const ErrorRecordSchema = new Schema({
  message: { type: String, default: '' }, // 错误信息
  code: { type: String, default: '' }, // response status
  method: { type: String, default: '' }, // 请求的类型
  path: { type: String, default: '' }, // 请求的路径
  param: { type: String, default: '' }, // 请求的参数
  username: { type: String, default: '' }, // 当前登录用户
  stack: { type: String, default: '' },
  created: { type: Date }
})

ErrorRecordSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

const ErrorRecord = mongoose.model('error_record', ErrorRecordSchema)

export default ErrorRecord
