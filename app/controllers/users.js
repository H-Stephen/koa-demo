const User = require('../models/users');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');

class UserController {
    async list(ctx) {
        const { page = 1, size = 10 } = ctx.query;
        ctx.body = await User.find({ name: new RegExp(ctx.query.name) })
            .limit(size)
            .skip((page - 1) * size);
    }
    async getById(ctx) {
        const { fields } = ctx.query;
        const selectFields = // 查询条件
            fields &&
            fields
                .split(';')
                .filter((f) => f)
                .map((f) => ' +' + f)
                .join('');
        const populateStr = // 展示字段
            fields &&
            fields
                .split(';')
                .filter((f) => f)
                .map((f) => {
                    if (f === 'employments') {
                        return 'employments.company employments.job';
                    }
                    if (f === 'educations') {
                        return 'educations.school educations.major';
                    }
                    return f;
                })
                .join(' ');
        const user = await User.findById(ctx.params.id)
            .select(selectFields)
            .populate(populateStr);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }
    async add(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true },
        });
        const { name } = ctx.request.body;
        const repeatedUser = await User.findOne({ name });
        if (repeatedUser) {
            // 校验用户名是否已存在
            ctx.throw(409, '用户名已存在');
        }
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }
    async remove(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.status = 204;
    }
    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true },
        });
        const user = await User.findOne(ctx.request.body);
        if (!user) {
            ctx.throw(401, '用户名或密码不正确');
        }
        const { _id, name } = user;
        const token = jsonwebtoken.sign({ _id, name }, secret, {
            expiresIn: '1d',
        });
        ctx.body = { token };
    }
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
        });
        const user = await User.findByIdAndUpdate(
            ctx.params.id,
            ctx.request.body
        );
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }
}

module.exports = new UserController();
