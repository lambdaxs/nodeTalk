/**
 * Created by xiaos on 16/11/14.
 */
const router = require('express').Router()
const path = require('path')
const sha1 = require('sha1')

const {filterLogin,filterNotLogin} = require('../middle/checkLogin')
const {vail,vails,required} = require('../middle/vail')

const userModel = require('../models/user')
const postModel = require('../models/post')


//登录 filter过滤已经登录的用户
router.route('/signin')
    .get(filterLogin,(req,res,next)=>{
        return res.render('signin')
    })
    .post(filterLogin,(req,res)=>{
        const {name,password} = req.body

        userModel.getUserByNmae(name)
            .then(user=>{
                if (!user){
                    req.flash('error','用户不存在')
                    return res.redirect('/user/signin')
                }
                if (sha1(password) !== user.password){
                    req.flash('error','密码错误')
                    return res.render('/user/signin')
                }
                req.flash('success','登录成功')
                delete user.password
                req.session.user = user
                return res.redirect('/index')
            })
            .catch(err=>{
                return res.render('error',{
                    error:err
                })
            })
    })

//注册 filter 过滤掉已经登录的
router.route('/signup')
    .get(filterLogin,(req,res,next)=>{
        res.render('signup')
    })
    .post(filterLogin,(req,res)=>{

        const handle = (err,fields,files)=>{
            if (err){
                req.flash(err,'表单解析错误'+err.message)
                return res.render('error',{
                    error:err
                })
            }

            const {name:[name],password:[password],repassword:[repassword],bio:[bio],gander:[gander]} = fields
            const avatar = path.basename(files.avatar[0].path)

            try{
                required([name,password,repassword,bio,gander,avatar])
                const schemas = [
                    {
                        vail:password.length>=6&&password.length<=16,
                        msg:'password长度区间[6,16]'
                    },{
                        vail:password===repassword,
                        msg:'两次密码不一致'
                    }
                ]
                vails(schemas)
            }catch (err){
                req.flash('error',err.message)
                return res.redirect('/user/signup')
            }

            const user = {
                name,
                password:sha1(password),
                gander,
                bio,
                avatar
            }
            userModel.create(user)
                .then(user=>{
                    delete user.password
                    req.session.user = user
                    req.flash('success','注册成功')
                    return res.redirect('/post/list/1/10')
                })
                .catch(err=>{
                    if (e.message.match('E11000 duplicate key')) {
                        req.flash('error', '用户名已被占用')
                    }else {
                        req.flash('error',err.message)
                    }
                    return res.redirect('/user/signup')
                })
        }
        const multiparty = require('multiparty')
        const options = {
            maxFieldsSize:2*1024*1024,
            maxFilesSize:1,
            uploadDir:path.join(req.appDir,'public/images')
        }
        const form = new multiparty.Form(options)
        form.parse(req, handle)
    })

//注销
router.route('/signout')
    .get(filterNotLogin,(req,res,next)=>{
        req.session.user = null
        req.flash('success','注已销')
        res.redirect('/index')
    })

module.exports = {
    router:router
}