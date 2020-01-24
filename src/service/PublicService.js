import Codes from '@/common/Constants'
import User from '@/model/User'

class PublicService {
  // 登录
  async login (ctx) {
    const { body } = ctx.request
    if (body.username) {
      const user = await User.findOne({ username: body.username })
      if (user) {
        ctx.body = {
          code: Codes.OK,
          msg: '登录成功'
        }
      }
    }
    // ctx.body = {
    //   code: Codes.ERROR,
    //   msg: 'login fail'
    // }
  }

  // 注册
  async reg (ctx) {
    const { body } = ctx.request
    if (body.username) {
      const user = await User.findOne({ username: body.username })
      if (user) {
        ctx.body = {
          code: Codes.DUPULICATE_EMAIL,
          msg: '该邮箱已经注册！'
        }
        return
      }
    }
    // 同理手机注册
    const newOne = new User({
      username: body.username
    })
    newOne.setPassword(body.password)
    const result = await newOne.save()
    ctx.body = {
      code: Codes.OK,
      data: result,
      msg: 'login success'
    }
  }
}

export default new PublicService()
