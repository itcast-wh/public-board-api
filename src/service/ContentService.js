import Vote from '../model/Vote'
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
}

export default new ContentService()
