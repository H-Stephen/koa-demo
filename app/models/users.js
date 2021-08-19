const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        __v: { type: Number, select: false },
        name: { type: String, required: true },
        password: { type: String, required: true, select: false },
        gender: {
            //   性别
            type: String,
            enum: ['male', 'female'],
            default: 'male',
            required: true,
        },
        locations: {
            // 居住地
            type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
            select: false,
        },
        business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false }, // 职业
    },
    { timestamps: true }
);

module.exports = model('User', userSchema);
