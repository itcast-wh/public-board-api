import Router from 'koa-router'
import PublicService from '@/service/PublicService'

const router = new Router()

router.prefix('/public')

router.post('/login', PublicService.login)

export default router
