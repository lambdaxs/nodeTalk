/**
 * Created by xiaos on 16/11/24.
 */

const mongoose = require('mongoose')
const commentModel = require('../lib/mongo').Comment
const userModel = require('../lib/mongo').User
const postModel = require('../lib/mongo').Post

module.exports = {
    getCountByPostId(postId){
        return commentModel.count({postId:postId}).exec()
    },
    create(data){
        return commentModel.create(data)
    },
    getListByPostId(postId){
        return commentModel.find({postId})
            .populate({model:userModel,path:'author',select:'_id name bio avatar'})
            .sort({_id:-1})
            .exec()
    }
}