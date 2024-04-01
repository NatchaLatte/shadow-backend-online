const mysql = require('mysql2/promise')
const assert = require('assert')
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const storageGeneralProduct = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/general-product')
    },
    filename: (request, file, callback) => {
        const fileExtension = file.originalname.split('.')[1]
        const fileName = `${uuid.v4()}${Date.now()}${Math.round(Math.random() * 1E9)}.${fileExtension}`
        callback(null, fileName)
        request.on('aborted', () => {
            const fullPath = path.join('./public/images/general-product', fileName)
            fs.unlinkSync(fullPath)
        })
    }
})

const upload = multer({
    storage: storageGeneralProduct,
    fileFilter: (request, file, callback) => {
        if (file.mimetype === 'image/png') {
            callback(null, true)
        } else {
            callback(new Error('ใช้ได้แค่ไฟล์ .png เท่านั้น'), false)
        }
    }
})

module.exports.createGeneralProduct = async (request, response) => {
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
        upload.single('file')(request, response, async (error) => {
            if(error){
                response.status(200).json({status: false, payload: error.message})
            }else{
                try{
                    const requestUUID = uuid.v4()
                    const requestProductId = request.body.productId
                    const requestGameName = request.body.gameName
                    const requestName = request.body.name
                    const requestNormalPrice = request.body.normalPrice
                    const requestSpecialPrice = request.body.specialPrice
                    const requestInformation = request.file.filename
                    const requestDescription = request.body.description
                    await connection.query('INSERT INTO general_product (uuid, product_id, game_name, name, normal_price, special_price, special_price_status, information, description, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [requestUUID, requestProductId, requestGameName, requestName, requestNormalPrice, requestSpecialPrice, false, requestInformation, requestDescription, new Date(), new Date()])
                    response.status(200).json({status: true, payload: 'การเพิ่มสินค้าสำเร็จ'})
                }catch(error){
                    try{
                        fs.unlinkSync(path.join('./public/images/general-product', request.file.filename))
                    }catch(error){}finally{
                        if(error.code === 'ECONNREFUSED'){
                            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
                        }else{
                            response.status(200).json({status: false, payload: 'การเพิ่มสินค้าล้มเหลว'})
                        }
                    }
                }
            }
        })
    }catch(error){
        try{
            fs.unlinkSync(path.join('./public/images/general-product', request.file.filename))
        }catch(error){
            if(error.code === 'ECONNREFUSED'){
                response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
            }else{
                response.status(200).json({status: false, payload: 'การเพิ่มสินค้าล้มเหลว'})
            }
        }finally{
            if(error.code === 'ECONNREFUSED'){
                response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
            }else{
                response.status(200).json({status: false, payload: 'การเพิ่มสินค้าล้มเหลว'})
            }
        }
    }
}

module.exports.readGeneralProduct = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGeneralProductWithUUID = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product WHERE uuid = ?',
        [requestUUID])
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGeneralProductOldToNew = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product ORDER BY update_at')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGeneralProductNewToOld = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product ORDER BY update_at DESC')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGeneralProductCheapToExpensive = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product ORDER BY normal_price')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGeneralProductExpensiveToCheap = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product ORDER BY normal_price DESC')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGeneral3Product = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product LIMIT 3')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.updateGeneralProduct = async (request, response) => { // แก้รูปภาพไม่ได้
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
        const requestName = request.body.name
        const requestGameName = request.body.game_name
        const requestNormalPrice = request.body.normal_price
        const requestSpecialPrice = request.body.special_price
        const requestInformation = request.body.information
        const requestDescription = request.body.description
        // แก้ไขรูปภาพไม่ได้ (information)
        await connection.query('UPDATE general_product SET name = ? , game_name = ? , normal_price = ? , special_price = ? , information = ? , description = ? , update_at = ? WHERE uuid = ? LIMIT 1',
        [requestName, requestGameName, requestNormalPrice, requestSpecialPrice, requestInformation, requestDescription, new Date(), requestUUID])
        response.status(200).json({status: true, payload: 'การแก้ไขสินค้าสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขสินค้าล้มเหลว'})
        }
    }
}

module.exports.updateStatusPrice = async (request, response) => {
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
        const requestStatus = request.body.special_price_status
        if(requestStatus === 0){
            await connection.query('UPDATE general_product SET special_price_status = 1, update_at = ? WHERE uuid = ? LIMIT 1',
            [new Date(), requestUUID])
            response.status(200).json({status: true, payload: 'เปิดสถานะการลดราคาสำเร็จ'})
        }else if(requestStatus === 1){
            await connection.query('UPDATE general_product SET special_price_status = 0, update_at = ? WHERE uuid = ? LIMIT 1',
            [new Date(), requestUUID])
            response.status(200).json({status: true, payload: 'ปิดสถานะการลดราคาสำเร็จ'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขสถานะล้มเหลว'})
        }
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขสถานะล้มเหลว'})
        }
    }
}

module.exports.deleteGeneralProduct = async (request, response) => {
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
        const [results] = await connection.query('SELECT information FROM general_product WHERE uuid = ?', [requestUUID])
        assert(results.length > 0)
        const information = results[0].information
        await connection.query('DELETE FROM general_product WHERE uuid = ?', [requestUUID])
        fs.unlinkSync(path.join('./public/images/general-product', information))
        response.status(200).json({status: true, payload: 'การลบสินค้าสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การลบสินค้าล้มเหลว'})
        }
    }
}

module.exports.readPromotionProduct = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product WHERE special_price_status = 1')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readPromotionProductWithUUID = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product WHERE special_price_status = 1 and uuid = ?',
        [requestUUID])
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGeneralProductWithName = async (request, response) => {
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
        const requestName = request.params.name
        const [results] = await connection.query('SELECT * FROM general_product WHERE name = ?', [requestName])
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readPromotionProductOldToNew = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product WHERE special_price_status = 1 ORDER BY update_at')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readPromotionProductNewToOld = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product WHERE special_price_status = 1 ORDER BY update_at DESC')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readPromotionProductCheapToExpensive = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product WHERE special_price_status = 1 ORDER BY normal_price')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readPromotionProductExpensiveToCheap = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product WHERE special_price_status = 1 ORDER BY normal_price DESC')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readPromotion3Product = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM general_product WHERE special_price_status = 1 LIMIT 3')
        assert(results.length > 0)
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}