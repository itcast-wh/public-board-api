import Vote from '../model/Vote'
import { getJWTPayload } from '@/common/Utils'
import Codes from '@/common/Constants'
class ContentService {
  // 获取首页投票列表
  async getList (ctx) {
    const params = ctx.query
    const text = params.text
    const page = params.page ? params.page : 0
    const limit = params.limit ? parseInt(params.limit) : 10
    const result = await Vote.getVoteList(text, page, limit)
    ctx.body = {
      code: 200,
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
        code: 200,
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
}

export default new ContentService()
