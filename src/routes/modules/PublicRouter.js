import Router from 'koa-router'
import PublicService from '@/service/PublicService'
import ContentService from '@/service/ContentService'

const router = new Router()

router.prefix('/public')

router.post('/login', PublicService.login)

router.post('/reg', PublicService.reg)

router.get('/list', ContentService.getList)

export default router
