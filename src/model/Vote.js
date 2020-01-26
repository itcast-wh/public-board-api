import mongoose from '../config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const VoteSchema = new Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  uid: { type: String, ref: 'user' },
  created: { type: Date },
  updated: { type: Date },
  status: { type: String, default: 0 }
})

VoteSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

VoteSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

VoteSchema.statics = {
  getVoteList: function (text, page, limit) {
    return this.find({ title: (text === '' ? { $ne: '' } : { $regex: text, $options: 'i' }) })
      .skip(page * limit)
      .limit(limit)
      .sort({ likes: -1 })
  },
  findByID: function (id) {
    return this.findOne({ _id: id })
  }
}

const Vote = mongoose.model('vote', VoteSchema)

export default Vote
