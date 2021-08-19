const jsonwebtoken = require('jsonwebtoken');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const Router = require('koa-router');
const router = new Router({ prefix: '/users' }); // 路由前缀

const {
    list,
    getById,
    add,
    checkOwner,
    update,
    remove,
    login,
} = require('../controllers/users');

const auth = jwt({ secret });

router.get('/', list);
router.get('/:id', getById);
router.post('/', add); // 创建用户
router.delete('/:id', auth, checkOwner, remove); // 删除用户
router.post('/login', login); // 用户登录
router.put('/:id', auth, checkOwner, update); // 更新用户信息（需要jwt认证和验证操作用户身份）

module.exports = router;
