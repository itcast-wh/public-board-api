import { HttpException } from './HttpException'
import ErrorRecord from '@/model/ErrorRecord'

export default async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 开发环境
    const isHttpException = error instanceof HttpException
    const isDev = true

    // 取 username 并存入日志
    let param = ''
    if (ctx.method === 'GET') {
      param = JSON.stringify(ctx.request.query)
    } else if (ctx.method === 'POST') {
      param = JSON.stringify(ctx.request.body)
    }

    if (isDev) {
      // 开发环境，用于本地测试, 不用保存错误信息
      // await ErrorRecord.create({
      //   message: error.message, // msg 生成环境，message 开发环境
      //   code: ctx.response.status,
      //   method: ctx.method,
      //   path: ctx.path,
      //   param: param,
      //   stack: error.stack
      // })
      ctx.body = {
        msg: error.msg,
        code: error.errorCode,
        data: `${ctx.method} ${ctx.path}`
      }
    }

    if (isDev && !isHttpException) {
      throw error
    }

    // 生产环境
    if (isHttpException) {
      await ErrorRecord.create({
        message: error.msg,
        code: error.errorCode,
        method: ctx.method,
        path: ctx.path,
        param: param,
        stack: error.stack
      })

      ctx.body = {
        msg: error.msg,
        code: error.errorCode,
        data: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      ctx.body = {
        msg: '未知错误！',
        code: 9999,
        data: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}
