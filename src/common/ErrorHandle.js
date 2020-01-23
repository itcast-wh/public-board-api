import { HttpException } from './HttpException'
import { getJWTPayload } from '@/common/Utils'
import User from '@/model/User'
import ErrorRecord from '@/model/ErrorRecord'

export default async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 开发环境
    const isHttpException = error instanceof HttpException
    const isDev = true

    // 取 username 并存入日志
    let user
    const _authorization = ctx.header.authorization
    if (_authorization && (_authorization.split(' ')[1] !== 'undefined')) {
      const obj = getJWTPayload(_authorization)
      user = await User.findOne({ _id: obj._id })
    }

    let param = ''
    if (ctx.method === 'GET') {
      param = JSON.stringify(ctx.request.query)
    } else if (ctx.method === 'POST') {
      param = JSON.stringify(ctx.request.body)
    }

    if (isDev) {
      // 开发环境，用于本地测试
      await ErrorRecord.create({
        message: error.message, // msg 生成环境，message 开发环境
        code: ctx.response.status,
        method: ctx.method,
        path: ctx.path,
        param: param,
        username: user ? user.username : '',
        stack: error.stack
      })
    }

    if (isDev && !isHttpException) {
      throw error
    }

    // 生成环境
    if (isHttpException) {
      await ErrorRecord.create({
        message: error.msg,
        code: error.errorCode,
        method: ctx.method,
        path: ctx.path,
        param: param,
        username: user ? user.username : '',
        stack: error.stack
      })

      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      ctx.body = {
        msg: '未知错误！',
        error_code: 9999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}
