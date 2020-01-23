import mongoose from '../config/DBHelpler'
import moment from 'moment'

const Schema = mongoose.Schema

const VoteRecordSchema = new Schema({
  vid: { type: String, default: '' },
  uid: { type: String, ref: 'user' },
  created: { type: Date }
})

VoteRecordSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

VoteRecordSchema.statics = {
}

const Record = mongoose.model('vote-record', VoteRecordSchema)

export default Record
