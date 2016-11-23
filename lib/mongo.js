/**
 * Created by xiaos on 16/11/11.
 */
const mongoose = require('mongoose');    //引用mongoose模块
const config = require('config-lite')

const options = {
    server: { poolSize: 10 }
}
mongoose.connect(config.mongodb,options); //创建一个数据库连接

mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error',console.error.bind(console,'mongodb connect faild:'))
db.once('open',()=>{
    console.log("mongodb connect success")
})

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema({
    name      : {
        type: String,
        unique: true,
        required:[true,'name不能为空'],
        minlength:[5,'name长度不能低于5'],
        maxLength:[16,'name长度不能低于16']
    },
    password  : {
        type:String,
        required:true,
    },
    avatar    : {
        type:String,
        required:true,
        match:[/[.](png|jpg|jpeg|gif)$/,'图片格式应为png jpg jpeg gif']
    },
    bio       : {
        type:String,
        required:true,
        minLength:[1,'bio长度不能小于1'],
        maxLength:[30,'bio长度不能小于30']
    },
    gander    : {
        type:String,
        required:true,
        enum:{
            values:['m','f'],
            message:'性别只能为男或女'
        }
    },
    createdAt : {type:Date,default:Date.now}
})
UserSchema.index({name:1})
exports.User = mongoose.model('User', UserSchema);

const PostSchema = new Schema({
    author   : {
        type: ObjectId,
        ref: 'User',
        required:true
    },
    title    : {
        type:String,
        required:true,
        minLength:[1,'title长度最小为1'],
        maxLength:[64,'title长度最大为64']
    },
    content  : {
        type:String,
        required:true,
        minLength:[1,'content长度最小为1'],
        maxLength:[100000,'content长度最大为10w!']
    },
    pv       : {type:Number,default:0},
    createdAt : {type:Date,default:Date.now}
})
PostSchema.index({createdAt:-1})
exports.Post = mongoose.model('Post', PostSchema);

const CommentSchema = new Schema({
    author    : {
        type:ObjectId,
        ref:'User',
        required:true},
    content   : {
        type:String,
        required:true,
        minLength:[1,'comment长度最小为1'],
        maxLength:[200,'comment长度最大为200']
    },
    postId    : {type:ObjectId,ref:'Post',required:true},
    createdAt : {type:Date,default:Date.now}
})
CommentSchema.index({createdAt:-1})
exports.Comment = mongoose.model('Comment', CommentSchema);
