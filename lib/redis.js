/**
 * Created by xiaos on 16/11/14.
 */
const redis = require('redis')
const config = require('config-lite')
const {url,port,options} = config.redis
const client = redis.createClient(port,url,options)

client.on('error',()=>{
    console.log('redis connect faild')
})

client.on('ready',()=>{
    console.log('redis connect success')
})

exports.redisClient = client