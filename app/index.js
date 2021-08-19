const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const error = require('koa-json-error');
// 采用koa-parameter用于参数校验，它是基于参数验证框架parameter, 给 koa 框架做的适配。
const parameter = require('koa-parameter');
const koaStatic = require('koa-static');
const db = require('./db');
const routing = require('./routes');

const app = new Koa();
const router = new Router();

app.use(koaStatic(path.join(__dirname, 'public'))); // 静态资源

console.log(process.env.NODE_ENV)

// 错误会默认抛出堆栈信息stack，在生产环境中，没必要返回给用户，在开发环境显示即可。
app.use(
    error({
        postFormat: (e, { stact, ...rest }) =>
            process.env.NODE_ENV === 'production' ? rest : { stact, ...rest },
    })
);

app.use(
    // 处理post请求和图片上传
    koaBody({
        multipart: true, //支持文件上传
        // encoding: 'gzip',
        formidable: {
            uploadDir: path.join(__dirname, '/public/uploads'),
            keepExtensions: true,
        },
    })
);

app.use(parameter(app)); // 校验参数
routing(app); // 路由处理

app.listen(3000, () => console.log('程序启动在3000端口了'));
