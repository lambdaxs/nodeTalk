/**
 * Created by xiaos on 16/11/21.
 */
module.exports = {
    filterNotLogin(req,res,next){
        if (!req.session.user) {
            req.flash('error', '未登录');
            return res.redirect('/index');
        }
        next();
    },
    filterLogin(req,res,next){
        if (req.session.user) {
            req.flash('error', '已登录,请先注销再注册新账户');
            return res.redirect('/index');
        }
        next();
    }
}