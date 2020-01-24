import Codes from '@/common/Constants'
import User from '@/model/User'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config/index'
import { validatePbkdf2 } from '@/common/Utils'

const secret = config.secret

class PublicService {
  // 登录
  async login (ctx) {
    const { body } = ctx.request
    if (body.username) {
      const user = await User.findOne({ username: body.username })
      if (user && validatePbkdf2(body.password, user.password, user.salt)) {
        ctx.body = {
          code: Codes.OK,
          msg: '登录成功',
          data: user,
          token: jsonwebtoken.sign({
            _id: user._id
          }, secret, { expiresIn: '1d' })
        }
        return
      }
    }
    if (body.mobile) {
      const user = await User.findOne({ mobile: body.mobile })
      if (user && validatePbkdf2(body.password, user.password, user.salt)) {
        ctx.body = {
          code: Codes.OK,
          msg: '登录成功',
          token: jsonwebtoken.sign({
            _id: user._id
          }, secret, { expiresIn: '1d' })
        }
        return
      }
    }
    ctx.body = {
      code: Codes.ERROR,
      msg: '登录失败，请检查用户名密码！'
    }
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
    if (body.mobile) {
      const user = await User.findOne({ mobile: body.mobile })
      if (user) {
        ctx.body = {
          code: Codes.DUPULICATE_MOBILE,
          msg: '该手机已经注册！'
        }
        return
      }
    }
    // 保存用户信息
    let newOne
    if (body.username) {
      newOne = new User({
        username: body.username,
        password: body.password,
        name: body.name
      })
    }

    if (body.mobile) {
      newOne = new User({
        mobile: body.mobile,
        password: body.password,
        name: body.name
      })
    }
    let user = await newOne.save()
    user = user.toJSON()
    delete user.password
    ctx.body = {
      code: Codes.OK,
      data: user,
      token: jsonwebtoken.sign({
        _id: user._id
      }, secret, { expiresIn: '1d' }),
      msg: 'login success'
    }
  }
}

export default new PublicService()
