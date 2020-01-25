import Vote from '../model/Vote'
import VoteRecord from '../model/VoteRecord'
import Comments from '../model/Comments'
import { getJWTPayload } from '@/common/Utils'
import Codes from '@/common/Constants'
class ContentService {
  // 获取首页投票列表
  async getList (ctx) {
    const params = ctx.query
    const text = params.text
    const page = params.page ? params.page : 0
    const limit = params.limit ? parseInt(params.limit) : 10
    let result = await Vote.getVoteList(text, page, limit)
    if (typeof ctx.header.authorization !== 'undefined') {
      const obj = await getJWTPayload(ctx.header.authorization)
      result = result.map(item => item.toJSON())
      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        const record = await VoteRecord.findOne({ vid: item._id, uid: obj._id })
        if (record) {
          item.handed = 1
        }
      }
    }
    ctx.body = {
      code: Codes.OK,
      msg: '获取成功',
      data: result
    }
  }

  // 添加新的内容
  async addVote (ctx) {
    const { body } = ctx.request
    if (typeof ctx.header.authorization !== 'undefined' && ctx.header.authorization.split(' ').length > 1) {
      const obj = await getJWTPayload(ctx.header.authorization)
      body.uid = obj._id
      const newVote = new Vote(body)
      const result = await newVote.save()
      ctx.body = {
        code: Codes.OK,
        data: result,
        msg: '添加成功'
      }
    } else {
      ctx.body = {
        code: Codes.NOAUTH,
        msg: 'Header数据未传递'
      }
    }
  }

  // 获取投票内容
  async getDetail (ctx) {
    const params = ctx.query
    const result = await Vote.findByID(params.id)
    if (result.title) {
      ctx.body = {
        code: Codes.OK,
        data: result,
        msg: '获取成功'
      }
    } else {
      ctx.body = {
        code: Codes.ERROR,
        msg: '获取失败！无该数据！'
      }
    }
  }

  // 更新内容

  // 获取评论列表
  async getComments (ctx) {
    const params = ctx.query
    const id = params.id
    const page = params.page ? params.page : 0
    const limit = params.limit ? parseInt(params.limit) : 10
    const result = await Comments.getCommentsList(id, page, limit)
    ctx.body = {
      code: Codes.OK,
      msg: '获取成功',
      data: result
    }
  }

  // 添加评论
  async addComments (ctx) {
    const { body } = ctx.request
    if (typeof ctx.header.authorization !== 'undefined' && ctx.header.authorization.split(' ').length > 1) {
      const obj = await getJWTPayload(ctx.header.authorization)
      body.uid = obj._id
      const newComment = new Comments(body)
      const result = await newComment.save()
      ctx.body = {
        code: Codes.OK,
        data: result,
        msg: '添加成功'
      }
    } else {
      ctx.body = {
        code: Codes.NOAUTH,
        msg: 'Header数据未传递'
      }
    }
  }

  // 投票点赞
  async handsVote (ctx) {
    const params = ctx.query
    const obj = await getJWTPayload(ctx.header.authorization)
    const old = await VoteRecord.findOne({ vid: params.id, uid: obj._id })
    let result
    if (old && old.created) {
      result = await VoteRecord.deleteOne(old)
      await Vote.updateOne({ _id: params.id }, { $inc: { likes: -1 } })
      ctx.body = {
        code: Codes.OK,
        msg: '删除成功'
      }
    } else {
      const record = new VoteRecord({
        vid: params.id,
        uid: obj._id
      })
      result = await record.save()
      await Vote.updateOne({ _id: params.id }, { $inc: { likes: 1 } })
      ctx.body = {
        code: Codes.OK,
        data: result,
        msg: '成功点赞！'
      }
    }
  }
}

export default new ContentService()
