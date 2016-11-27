/**
 * Created by xiaos on 16/11/21.
 */
const router = require('express').Router()
const path = require('path')
const moment = require('moment')
const util = require('../lib/util')

const filterNotLogin = require('../middle/checkLogin').filterNotLogin
const postModel = require('../models/post')
const commentModel = require('../models/comment')


//话题首页列表
router.route('/list/:page')
    .get((req,res,next)=>{
        const page = req.params.page*1 || 1
        const count = req.query.count || 10
        const skip = (page-1)*count

        Promise.all([postModel.getList(skip,count),postModel.getCount()])
            .then(rs=>{
                const [posts,maxCount] = rs
                const pageOptions = util.page(page,count,maxCount,'/post/list')

                Promise.all(posts.map(post=>{
                    return commentModel.getCountByPostId(post._id)
                })).then(counts=>{
                    const result = posts.map((post,index)=>{
                        post.commentCount = counts[index]||0
                        return post
                    })
                    return res.render('post',{
                        posts:result,
                        page:pageOptions
                    })
                })

            })
            .catch(err=>{
                next(err)
            })
    })

//个人主页列表
router.route('/mine/:page')
    .get(filterNotLogin,(req,res,next)=>{
        const userId = req.session.user._id
        const page = req.params.page*1 || 1
        const count = req.query.count || 10
        const skip = (page-1)*count

        Promise.all([postModel.getListByUserId(userId,skip,count),postModel.getListCountByUserId(userId)])
            .then(rs=>{
                const [posts,maxCount] = rs
                const pageOptions = util.page(page,count,maxCount,'/post/mine')
                const result = posts.map(post=>{
                    post.isSelf = true
                    return post
                })
                return res.render('post',{
                    posts:result,
                    page:pageOptions
                })
            })
            .catch(err=>{
                req.flash('error',err.message)
                return res.render('error',{
                    error:err
                })
            })
    })

//文章详情
router.route('/detail/:id')
    .get((req,res,next)=>{
        const id = req.params.id
        Promise.all([postModel.getById(id),commentModel.getListByPostId(id),postModel.incPv(id)])
            .then(rs=>{
                const [post,comments,_] = rs
                return res.render('post',{
                    posts:[post],
                    postId:post._id,
                    comments,
                    detail:true
                })
            })
            .catch(error=>{
                return res.render('error',{
                    error
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
            req.flash('success','发布成功')
            return res.render('post',{
                posts:[post]
            })
        }).catch(err=>{
            return res.render('error',{
                error:err
            })
        })
    })

//删除话题
router.route('/remove/:postId')
    .get(filterNotLogin,(req,res,next)=>{
        const userId = req.session.user._id
        const postId = req.params.postId
        postModel.deleteById(userId,postId)
            .then(rs=>{
                req.flash('success','删除成功')
                return res.redirect('back')
            })
            .catch(error=>{
                req.flash('error','删除失败')
                return res.redirect('back')
            })
    })

//发布评论
router.route('/commemt/:postId')
    .post(filterNotLogin,(req,res,next)=>{
        const postId = req.params.postId
        const author = req.session.user._id
        const content = req.body.content

        commentModel.create({
            postId,
            author,
            content
        }).then(com=>{
            req.flash('success','评论成功')
            return res.redirect(`/post/detail/${postId}`)
        }).catch(error=>{
            req.flash('error','评论失败')
            return res.redirect(`/post/detail/${postId}`)
        })
    })


module.exports = {
    router
}