/**
 * Created by xiaos on 16/11/14.
 */

const controller = (app)=> {
    app.get('/index',  (req, res) => {
        return res.render('index')
    })
    app.use('/post',require('./post').router)
    app.use('/user', require('./user').router)
}

module.exports = controller;