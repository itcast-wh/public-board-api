class PublicService {
  // 登录
  async login (ctx) {
    ctx.body = {
      msg: 'login success'
    }
  }

  // 注册
  async reg (ctx) {
    ctx.body = {
      msg: 'reg success'
    }
  }
}

export default new PublicService()
