import Router from 'koa-router'
import PublicService from '@/service/PublicService'
import ContentService from '@/service/ContentService'

const router = new Router()

router.prefix('/public')

// 用户登录
router.post('/login', PublicService.login)

// 用户注册
router.post('/reg', PublicService.reg)

// 用户投票列表
router.get('/list', ContentService.getList)

// 获取投票详情
router.get('/detail', ContentService.getDetail)

// 获取评论列表
router.get('/comments', ContentService.getComments)

export default router
