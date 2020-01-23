class ContentService {
  // 获取首页投票列表
  async getList (ctx) {
    ctx.body = {
      msg: '获取成功'
    }
  }
}

export default new ContentService()
