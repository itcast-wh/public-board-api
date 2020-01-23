class PublicService {
  async login (ctx) {
    ctx.body = {
      msg: 'login success'
    }
  }
}

export default new PublicService()
