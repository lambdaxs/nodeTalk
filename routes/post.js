/**
 * Created by xiaos on 16/11/21.
 */
const router = require('express').Router()
const path = require('path')
const moment = require('moment')

const filterNotLogin = require('../middle/checkLogin').filterNotLogin
const postModel = require('../models/post')


//话题首页列表
router.route('/list/:page/:count')
    .get((req,res,next)=>{
        const page = req.params.page*1 || 1
        const count = req.params.count*1 || 10
        const skip = (page-1)*count
        postModel.getList(skip,count)
            .then(posts=>{
                return res.render('post',{
                    posts,
                    helpers:{
                        date(date){
                            return moment(date).format("YYYY/MM/DD hh:mm:ss")
                        }
                    }
                })
            })
            .catch(err=>{
                next(err)
            })
    })

//发布话题
router.route('/create')
    .get(filterNotLogin,(req,res,next)=>{
        res.render('create')
    })
    .post(filterNotLogin,(req,res,next)=>{
        const author = req.session.user._id
        const {title,content} = req.body

        postModel.create({
            author,
            title,
            content
        }).then(post=>{
            return postModel.getById(post._id)
        }).then(post=>{
            return res.render('post',{
                posts:[post],
                helpers:{
                    date(date){
                        return moment(date).format("YYYY/MM/DD hh:mm:ss")
                    }
                }
            })
        }).catch(err=>{
            return res.render('error',{
                error:err
            })
        })
    })


module.exports = {
    router
}