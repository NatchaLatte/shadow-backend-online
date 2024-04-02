const mysql = require('mysql2/promise')
const assert = require('assert')
const uuid = require('uuid')

module.exports.gameNameInsert = async (request, response) => {
    const requestGameName = request.body.gameName
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    })
    try{
        const requestUUID = uuid.v4()
        await connection.query('INSERT INTO game_name (uuid, game_name) VALUES (?, ?)',
        [requestUUID, requestGameName])
        connection.end()
        response.status(200).json({status: true, payload: `การเพิ่มเกมชื่อ ${requestGameName} สำเร็จ`})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else if(error.code === 'ER_DUP_ENTRY'){
            response.status(200).json({status: false, payload: `มีชื่อเกม ${requestGameName} ในระบบแล้ว`})
        }else{
            response.status(200).json({status: false, payload: `การเพิ่มเกมชื่อ ${requestGameName} ล้มเหลว`})
        }
    }
}

module.exports.gameNameSelect = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    })
    try{
        const [results] = await connection.query('SELECT uuid, game_name, create_at, update_at from game_name')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแสดงชื่อเกมล้มเหลว'})
        }
    }
}

module.exports.gameNameUpdate = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    })
    try{
        const requestUUID = request.params.uuid
        const requestGameName = request.body.game_name
        await connection.query('UPDATE game_name SET game_name = ?, update_at = ? WHERE uuid = ?',
        [requestGameName, new Date(), requestUUID])
        connection.end()
        response.status(200).json({status: true, payload: 'การแก้ไขชื่อเกมสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขชื่อเกมล้มเหลว'})
        }
    }
}

module.exports.gameNameDelete = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    })
    try{
        const requestUUID = request.params.uuid
        await connection.query('DELETE FROM game_name WHERE uuid = ?',
        [requestUUID])
        connection.end()
        response.status(200).json({status: true, payload: 'การลบชื่อเกมสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การลบชื่อเกมล้มเหลว'})
        }
    }
}