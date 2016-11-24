/**
 * Created by xiaos on 16/11/14.
 */
const mongoose = require('mongoose')
const userModel = require('../lib/mongo').User
const postModel = require('../lib/mongo').Post

module.exports = {
    create(postData) {
        return postModel
            .create(postData)
    },
    //通过文章id和用户id编辑文章
    updateById(postId,userId,data){
        return postModel
            .update({_id:postId,poster:userId},{$set:data})
            .exec()
    },
    //通过文章id过去单个文章
    getById(postId){
        return postModel
            .findOne({_id:postId})
            .populate({path:'author',model:userModel})
            .exec()
    },
    //获取首页文章列表
    getList(skip,count){
      return postModel
          .find()
          .populate({model:userModel,path:'author',select:'_id name avatar gander bio'})
          .skip(skip)
          .limit(count)
          .sort({_id:-1})
          .exec()
    },
    //通过用户id获取文章列表
    getListByUserId(userId){
        var query = {}
        if (userId){
            query.author = userId
        }
        return postModel
            .find(query)
            .populate({path:'author',model:userModel,select:'_id name avatar gander bio'})
            .sort({_id:-1})
            .exec()
    },
    //删除文章
    delById(userId,postId){
        return postModel.remove({poster:userId,_id:postId}).exec()
    },
    //浏览量+1
    incPv(postId){
        return postModel.update({_id:postId},{$inc:{pv:1}}).exec()
    },
    getCount(){
        return postModel.count({}).exec()
    }


}
