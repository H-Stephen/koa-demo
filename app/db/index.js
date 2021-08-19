const mongoose = require('mongoose');
const DB_ADDRESS = 'mongodb://localhost:27017/koa-demo-db';

mongoose.connect(
    DB_ADDRESS,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    () => console.log('mongoodb 连接成功！')
);

mongoose.connection.on('error', console.error);

module.exports = mongoose;