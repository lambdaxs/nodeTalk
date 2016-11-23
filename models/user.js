/**
 * Created by xiaos on 16/11/15.
 */
const userModel = require('../lib/mongo').User
const postModel = require('../lib/mongo').Post

module.exports = {
    //新建用户
    create:(data)=>{
        return userModel.create(data)
    },
    getUserByNmae(name){
      return userModel.findOne({name:name}).exec()
    },
    //用户新建文章
    createPost:(userId,postId)=>{
        return userModel
            .update({_id:userId},{$addToSet:{posts:postId}})
            .exec()
    },
    //获取用户的文章列表
    postList:(userId)=>{
        return userModel
            .find({_id:userId})
            .populate({path:"posts",model:postModel})
            .sort({_id:-1})
            .exec()
    }
}