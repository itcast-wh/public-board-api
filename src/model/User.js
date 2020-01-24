import mongoose from '../config/DBHelpler'
import moment from 'moment'
import { pbkdf2 } from '@/common/Utils'

const Schema = mongoose.Schema

/* eslint no-useless-escape: 0 */
const UserSchema = new Schema({
  mobile: {
    type: String,
    match: /^1[3-9](\d{9})$/,
    default: ''
  },
  password: { type: String, match: /\w+/ },
  username: {
    type: String,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    index: { unique: true, dropDups: true },
    sparse: true,
    default: ''
  },
  name: { type: String, default: '' },
  salt: { type: String, default: '' },
  roles: { type: Array, default: [] },
  created: { type: Date },
  updated: { type: Date },
  pic: { type: String, default: '' },
  status: { type: String, default: '0' }
})

// 使用middleware，每次保存都记录一下最后更新时间
UserSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  if (this.password) {
    const { salt, hash } = pbkdf2(this.password)
    this.password = hash
    this.salt = salt
  }
  next()
})

UserSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

UserSchema.statics = {
}

const User = mongoose.model('user', UserSchema)

export default User
