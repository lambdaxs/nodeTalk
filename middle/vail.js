/**
 * Created by xiaos on 16/11/21.
 */
class vailError extends Error {
}

const vail = (call,msg)=>{
    if (typeof call === 'function'){
        if (!call()){
            throw new Error(msg)
        }
    }else {
        if (!call){
            throw new Error(msg)
        }
    }
}

const vails = (schemas)=>{
    schemas.forEach(v=>{
        const call = v.vail
        const msg = v.msg
        vail(call,msg)
    })
}


function checkRequired(value) {
    switch (typeof value){
        case 'string':
            return value.length&&value.trim()
            break;
        case 'number':
            return true
            break;
        case 'boolean':
            return true
            break;
        case 'object':
            if (Array.isArray(value)){
                return value.length//[]
            }else {
                if (value){//{}
                    return Object.keys(value).length
                }else {//null
                    return false
                }
            }
            break;
        case 'undefined':
            return false
            break;
    }
}


module.exports = {
    vail,
    vails,
    required(params) {
        for (let key of Object.keys(params)) {
            const value = params[key]
            if (!checkRequired(value)){
                throw new Error(`${key}参数不能为空,传入的值为${value}`)
            }
        }
    }
}


