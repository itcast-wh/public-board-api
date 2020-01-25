
import { getJWTPayload } from '@/common/Utils'
export default async (ctx, next) => {
  if (typeof ctx.header.authorization !== 'undefined' && ctx.header.authorization.split(' ').length > 1) {
    const obj = await getJWTPayload(ctx.header.authorization)
    ctx.obj = obj
  }
  await next()
}
