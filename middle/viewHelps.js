/**
 * Created by xiaos on 16/11/25.
 */
const exphbs = require('express-handlebars'),
    moment = require('moment'),
    showdown  = require('showdown'),
    converter = new showdown.Converter()

const hbs = exphbs.create({
    defaultLayout:'main',
    extname: '.hbs',
    helpers: {
        formatDate(date){
            moment.locale('zh-cn')
            //间隔秒数
            const time = (Date.now()-date.getTime())/1000
            if (time < 10){
                return '刚刚'
            }else if(time<60){
                return `${parseInt(time)}秒前`
            }else if (time<=3600){
                return moment(date).startOf('minute').fromNow()
            }else if(time<=3600*5){
                return moment(date).startOf('hour').fromNow()
            }else if (time <= 3600*24*5){
                return moment(date).startOf('day').fromNow()
            }else {
                return moment(date).format('YYYY/MM/DD HH:mm')
            }
        },
        md2html(content){
            return converter.makeHtml(content)
        }
    }
})

module.exports = hbs