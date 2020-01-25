import mongoose from '../config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const CommentsSchema = new Schema({
  vid: { type: String, ref: 'vote' },
  uid: { type: String, ref: 'user' },
  tuid: { type: String, ref: 'user', default: '' },
  content: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  created: { type: Date },
  status: { type: String, default: 0 }
})

CommentsSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

CommentsSchema.statics = {
  getCommentsList: function (id, page, limit) {
    return this.find({ vid: id })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: 1 })
  }
}

const Comments = mongoose.model('comments', CommentsSchema)

export default Comments
