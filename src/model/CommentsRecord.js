import mongoose from '../config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const CommentsRecordSchema = new Schema({
  cid: { type: String, ref: 'vote' },
  uid: { type: String, ref: 'user' },
  created: { type: Date }
})

CommentsRecordSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

CommentsRecordSchema.statics = {
}

const Comments = mongoose.model('comments-record', CommentsRecordSchema)

export default Comments
