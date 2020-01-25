import Router from 'koa-router'
import ContentService from '@/service/ContentService'

const router = new Router()

router.prefix('/content')

router.post('/add', ContentService.addVote)

export default router
