/**
 * Created by xiaos on 16/11/14.
 */
const Sequelize = require('sequelize')
const config = require('config-lite')
const {url,port,username,password,database} = config.mysql

const mysqlClient = new Sequelize(database, username, password, {
    host: url,
    port:port,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

mysqlClient.define('user',{
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
},{
    timestamps:false
})

mysqlClient.sync()
    .then(()=>{
        console.log("mysql connect succes")
    })

exports.mysqlClient = mysqlClient


