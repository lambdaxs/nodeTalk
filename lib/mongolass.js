/**
 * Created by xiaos on 16/11/14.
 */
const config = require('config-lite');
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

exports.User = mongolass.model("User",{
    name:{type:'string'},
    password:{type:'string'},
    avatar:{type:'string'},
    bio:{type:'string'},
})