const mysql = require('mysql2/promise')
const jsonwebtoken = require('jsonwebtoken')
const SECRET = process.env.SECRET
const assert = require('assert')

module.exports.createHistoryProduct = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const requesUUID = request.body.uuid
        const requesEmail = request.body.email
        const requestGameName = request.body.game_name
        const requestProductName = request.body.product_name
        const requestProductPrice = request.body.product_price
        const requestBuyMethod = request.body.buy_method
        await connection.query('INSERT INTO history_product (uuid, email, game_name, product_name, product_price, buy_method, create_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [requesUUID, requesEmail, requestGameName, requestProductName, requestProductPrice, requestBuyMethod, new Date()])
        response.status(200).json({status: true, payload: 'การสร้างประวัติธุรกรรมสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การสร้างประวัติธุรกรรมล้มเหลว'})
        }
    }
}

module.exports.readHistoryProduct = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM history_product WHERE email = ?',
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

module.exports.readSumAysel = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const [results] = await connection.query('SELECT SUM(product_price) AS sumAysel FROM history_product')
        assert(results[0].sumAysel !== null)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแสดงข้อมูลล้มเหลว'})
        }
    }
}

module.exports.readSumBuyItems = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const [results] = await connection.query('SELECT COUNT(uuid) AS sumBuyItem FROM history_product')
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแสดงข้อมูลล้มเหลว'})
        }
    }
}