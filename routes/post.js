/**
 * Created by xiaos on 16/11/21.
 */
const router = require('express').Router()
const path = require('path')
const moment = require('moment')
const util = require('../lib/util')

const filterNotLogin = require('../middle/checkLogin').filterNotLogin
const postModel = require('../models/post')


//话题首页列表
router.route('/list/:page/:count')
    .get((req,res,next)=>{
        const page = req.params.page*1 || 1
        const count = req.params.count*1 || 10
        const skip = (page-1)*count

        Promise.all([postModel.getList(skip,count),postModel.getCount()])
            .then(rs=>{
                const [posts,maxCount] = rs
                return res.render('post',{
                    posts,
                    page:util.page(page,count,maxCount)
                })
            })
            .catch(err=>{
                next(err)
            })
    })

//个人主页列表
router.route('/mine')
    .get(filterNotLogin,(req,res,next)=>{
        const userId = req.session.user._id

        postModel.getListByUserId(userId)
            .then(posts=>{
                const rs = posts.map(post=>{
                    post.isSelf = true
                    return post
                })
                res.render('post',{
                    posts:rs
                })
            })
            .catch(err=>{
                req.flash('error',err.message)
                return res.render('error',{
                    error:err
                })
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