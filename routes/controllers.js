/**
 * Created by xiaos on 16/11/14.
 */
const util = require('../lib/util')

const controller = (app)=> {
    app.get('/index/:page',  (req, res) => {
        var page = req.params.page*1 || 1

        const maxPage = 10
        const data = {}
        if (page >= maxPage){
            data.last = true
            data.pre =  maxPage-1
        }else if (page == 1){
            data.first = true
            data.next =  page + 1
        }else {
            data.pre = page - 1
            data.next = page + 1
        }
        return res.render('index',data)
    })
    app.use('/post',require('./post').router)
    app.use('/user', require('./user').router)
}

module.exports = controller;