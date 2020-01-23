import Router from 'koa-router'
import PublicService from '@/service/PublicService'

const router = new Router()

router.prefix('/public')

router.post('/login', PublicService.login)

router.post('/reg', PublicService.reg)

export default router
