/**
 * Created by xiaos on 16/11/14.
 */
const util = require('../lib/util')
const postRouter = require('./post').router
const userRouter = require('./user').router

const controller = (app)=> {
    app.get('/index',  (req, res) => {
        return res.render('index')
    })
    app.use('/post',postRouter)
    app.use('/user',userRouter)
}

module.exports = controller;