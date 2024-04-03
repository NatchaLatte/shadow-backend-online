const mysql = require('mysql2/promise')
const assert = require('assert')
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const storageGachaProduct = multer.diskStorage({
    destination: async (request, file, callback) => {
        callback(null, './public/images/gacha-product')
    },
    filename: async (request, file, callback) => {
        const fileExtension = file.originalname.split('.')[1]
        const fileName = `${uuid.v4()}${Date.now()}${Math.round(Math.random() * 1E9)}.${fileExtension}`
        callback(null, fileName)
        request.on('aborted', () => {
            const fullPath = path.join('./public/images/gacha-product', fileName)
            fs.unlinkSync(fullPath)
        })
    }
})

const upload = multer({
    storage: storageGachaProduct,
    fileFilter: async (request, file, callback) => {
        if(file.mimetype === 'image/png'){
            callback(null, true)
        }else{
            callback(new Error('ใช้ได้แค่ไฟล์ .png เท่านั้น'), false)
        }
    }
})

module.exports.createGachaProduct = async (request, response) => {
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
                    const requestChance = request.body.chance
                    const requestGuaranteeStatus = request.body.guaranteeStatus
                    const requestInformation = request.file.filename
                    const requestDescription = request.body.description
                    await connection.query('INSERT INTO gacha_product (uuid, product_id, game_name, name, chance, guarantee_status, information, description, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [requestUUID, requestProductId, requestGameName, requestName, requestChance, requestGuaranteeStatus, requestInformation, requestDescription, new Date(), new Date()],)
                    connection.end()
                    response.status(200).json({status: true, payload: 'การเพิ่มสินค้ากาชาสำเร็จ'})
                }catch(error){
                    try{
                        fs.unlinkSync(path.join('./public/images/gacha-product', request.file.filename))
                    }catch(error){}finally{
                        if(error.code === 'ECONNREFUSED'){
                            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
                        }else{
                            response.status(200).json({status: false, payload: 'กรุณาเลือกรูปภาพ'})
                        }
                    }
                }
            }
        })
    }catch(error){
        try{
            fs.unlinkSync(path.join('./public/images/gacha-product', request.file.filename))
        }catch(error){}finally{
            if(error.code === 'ECONNREFUSED'){
                response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
            }else{
                response.status(200).json({status: false, payload: 'การเพิ่มสินค้ากาชาล้มเหลว'})
            }
        }
    }
}

module.exports.updateGachaProductImage = async (request, response) => {
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
                    const requestUUID = request.params.uuid
                    const requestName = request.body.name
                    const requestGameName = request.body.game_name
                    const requestChance = request.body.chance
                    const requestGuarantee = request.body.guarantee_status
                    const requestInformation = request.file.filename
                    const requestDescription = request.body.description
                    const [results] = await connection.query('SELECT information FROM gacha_product WHERE uuid = ?', [requestUUID])
                    assert(results.length > 0)
                    const information = results[0].information
                    fs.unlinkSync(path.join('./public/images/gacha-product', information))
                    await connection.query('UPDATE gacha_product SET name = ?, game_name = ?, chance = ?, guarantee_status = ?, information = ?, description = ?, update_at = ? WHERE uuid = ? LIMIT 1',
                    [requestName, requestGameName, requestChance, requestGuarantee, requestInformation, requestDescription, new Date(), requestUUID])
                    connection.end()
                    response.status(200).json({status: true, payload: 'การแก้ไขสินค้ากาชาสำเร็จ'})
                }catch(error){
                    try{
                        fs.unlinkSync(path.join('./public/images/gacha-product', request.file.filename))
                    }catch(error){}finally{
                        if(error.code === 'ECONNREFUSED'){
                            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
                        }else{
                            response.status(200).json({status: false, payload: 'การแก้ไขสินค้ากาชาล้มเหลว'})
                        }
                    }
                }
            }
        })
    }catch(error){
        try{
            fs.unlinkSync(path.join('./public/images/gacha-product', request.file.filename))
        }catch(error){}finally{
            if(error.code === 'ECONNREFUSED'){
                response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
            }else{
                response.status(200).json({status: false, payload: 'การแก้ไขสินค้าล้มเหลว'})
            }
        }
    }
}

module.exports.readGachaProduct = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGachaProductWithNormal = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product WHERE guarantee_status = 0')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGachaProductWithSpecial = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product WHERE guarantee_status = 1')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGachaProductWithUUID = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product WHERE uuid = ?',
        [requestUUID])
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGachaProductOldToNew = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product ORDER BY update_at')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGachaProductNewToOld = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product ORDER BY update_at DESC')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGachaProductCheapToExpensive = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product ORDER BY price')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGachaProductExpensiveToCheap = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product ORDER BY price DESC')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.readGacha3Product = async (request, response) => {
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
        const [results] = await connection.query('SELECT * FROM gacha_product LIMIT 3')
        assert(results.length > 0)
        connection.end()
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: []})
        }else{
            response.status(200).json({status: false, payload: []})
        }
    }
}

module.exports.updateGachaProduct = async (request, response) => {
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
        const requestChance = request.body.chance
        const requestGuarantee = request.body.guarantee_status
        const requestInformation = request.body.information
        const requestDescription = request.body.description
        // แก้ไขรูปภาพไม่ได้ (information)
        await connection.query('UPDATE gacha_product SET name = ?, game_name = ?, chance = ?, guarantee_status = ?, information = ?, description = ?, update_at = ? WHERE uuid = ? LIMIT 1',
        [requestName, requestGameName, requestChance, requestGuarantee, requestInformation, requestDescription, new Date(), requestUUID])
        connection.end()
        response.status(200).json({status: true, payload: 'การแก้ไขสินค้ากาชาสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            console.log(error)
            response.status(200).json({status: false, payload: 'การแก้ไขสินค้ากาชาล้มเหลว'})
        }
    }
}

module.exports.updateGuaranteeStatus = async (request, response) => {
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
        const requestStatus = request.body.guarantee_status
        if(requestStatus === 0){
            await connection.query('UPDATE gacha_product SET guarantee_status = 1, update_at = ? WHERE uuid = ? LIMIT 1',
            [new Date(), requestUUID])
            connection.end()
            response.status(200).json({status: true, payload: 'เปิดสถานะการการันตีสำเร็จ'})
        }else if(requestStatus === 1){
            await connection.query('UPDATE gacha_product SET guarantee_status = 0, update_at = ? WHERE uuid = ? LIMIT 1',
            [new Date(), requestUUID])
            connection.end()
            response.status(200).json({status: true, payload: 'ปิดสถานะการการันตีสำเร็จ'})
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

module.exports.deleteGachaProduct = async (request, response) => {
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
        const [results] = await connection.query('SELECT information FROM gacha_product WHERE uuid = ?', [requestUUID])
        assert(results.length > 0)
        const information = results[0].information
        await connection.query('DELETE FROM gacha_product WHERE uuid = ?', [requestUUID])
        connection.end()
        fs.unlinkSync(path.join('./public/images/gacha-product', information))
        response.status(200).json({status: true, payload: 'การลบสินค้ากาชาสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การลบสินค้ากาชาล้มเหลว'})
        }
    }
}