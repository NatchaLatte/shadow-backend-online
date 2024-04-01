const mysql = require('mysql2/promise')
const jsonwebtoken = require('jsonwebtoken')
const SECRET = process.env.SECRET

module.exports.createStoreProduct = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const requesUUID = uuid.v4()
        const requesEmail = request.body.email
        const requestGameName = request.body.game_name
        const requestProductName = request.body.product_name
        const requestUsedStatus = request.body.used_status
        const requestMethodUUID = request.body.method_uuid
        await connection.query('INSERT INTO store_product (uuid, email, method_uuid, game_name, product_name, used_status, create_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [requesUUID, requesEmail, requestMethodUUID, requestGameName, requestProductName, requestUsedStatus, new Date()])
        response.status(200).json({status: true, payload: 'การเพิ่มสินค้าสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การเพิ่มสินค้าล้มเหลว'})
        }
    }
}

module.exports.readStoreProduct = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const token = request.cookies.token
        const decoded = jsonwebtoken.verify(token, SECRET)
        const requestEmail = decoded.email
        const [results] = await connection.query('SELECT * FROM store_product WHERE email = ?',
        [requestEmail])
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแสดงข้อมูลล้มเหลว'})
        }
    }
}

module.exports.readLastedStoreProduct = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const token = request.cookies.token
        const decoded = jsonwebtoken.verify(token, SECRET)
        const requestEmail = decoded.email
        const [results] = await connection.query('SELECT * FROM store_product WHERE email = ? ORDER BY update_at DESC LIMIT 1',
        [requestEmail])
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแสดงข้อมูลล้มเหลว'})
        }
    }
}