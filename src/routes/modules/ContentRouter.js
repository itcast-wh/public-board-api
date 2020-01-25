import Router from 'koa-router'
import ContentService from '@/service/ContentService'

const router = new Router()

router.prefix('/content')

// 添加投票
router.post('/add', ContentService.addVote)

// 添加评论
router.post('/add-comments', ContentService.addComments)

// 投票点赞
router.get('/vote-like', ContentService.handsVote)

export default router
