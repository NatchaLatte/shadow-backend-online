const mysql = require('mysql2/promise')
const assert = require('assert')
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const storageAuctionProduct = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/auction-product')
    },
    filename: (request, file, callback) => {
        const fileExtension = file.originalname.split('.')[1]
        const fileName = `${uuid.v4()}${Date.now()}${Math.round(Math.random() * 1E9)}.${fileExtension}`
        callback(null, fileName)
        request.on('aborted', () => {
            const fullPath = path.join('./public/images/auction-product', fileName)
            fs.unlinkSync(fullPath)
        })
    }
})

const upload = multer({
    storage: storageAuctionProduct,
    fileFilter: (request, file, callback) => {
        if (file.mimetype === 'image/png') {
            callback(null, true)
        } else {
            callback(new Error('ใช้ได้แค่ไฟล์ .png เท่านั้น'), false)
        }
    }
})

module.exports.createAuctionProduct = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
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
                    const requestDefaultPrice = request.body.defaultPrice
                    const requestDefaultBid = request.body.defaultBid
                    const requestStartTime = request.body.startTime
                    const requestEndTime = request.body.endTime
                    const requestInformation = request.file.filename
                    const requestDescription = request.body.description
                    await connection.query('INSERT INTO auction_product (uuid, product_id, game_name, name, default_price, default_bid, auction_status, start_time, end_time, information, description, latest_bidder, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [requestUUID, requestProductId, requestGameName, requestName, requestDefaultPrice, requestDefaultBid, false, requestStartTime, requestEndTime, requestInformation, requestDescription, 'ไร้นาม', new Date(), new Date()],)
                    response.status(200).json({status: true, payload: 'การเพิ่มสินค้าประมูลสำเร็จ'})
                }catch(error){
                    try{
                        fs.unlinkSync(path.join('./public/images/auction-product', request.file.filename))
                    }catch(error){}finally{
                        if(error.code === 'ECONNREFUSED'){
                            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
                        }else{
                            response.status(200).json({status: false, payload: 'การเพิ่มสินค้าประมูลล้มเหลว'})
                        }
                    }
                }
            }
        })
    }catch(error){
        try{
            fs.unlinkSync(path.join('./public/images/auction-product', request.file.filename))
        }catch(error){}finally{
            if(error.code === 'ECONNREFUSED'){
                response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
            }else{
                response.status(200).json({status: false, payload: 'การเพิ่มสินค้าประมูลล้มเหลว'})
            }
        }
    }
}

module.exports.readAuctionProduct = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const [results] = await connection.query('SELECT * FROM auction_product')
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

module.exports.readAuctionProductAll = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const [results] = await connection.query('SELECT * FROM auction_product WHERE auction_status = 1')
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

module.exports.readAuctionProductWithUUID = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const requestUUID = request.params.uuid 
        const [results] = await connection.query('SELECT * FROM auction_product WHERE uuid = ?',
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

module.exports.readAuctionProductOldToNew = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const [results] = await connection.query('SELECT * FROM auction_product ORDER BY update_at')
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

module.exports.readAuctionProductNewToOld = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const [results] = await connection.query('SELECT * FROM auction_product ORDER BY update_at DESC')
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

module.exports.readAuctionProductCheapToExpensive = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const [results] = await connection.query('SELECT * FROM auction_product ORDER BY default_price')
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

module.exports.readAuctionProductExpensiveToCheap = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const [results] = await connection.query('SELECT * FROM auction_product ORDER BY default_price DESC')
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

module.exports.readAuction3Product = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const [results] = await connection.query('SELECT * FROM auction_product WHERE auction_status = 1 LIMIT 3')
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

module.exports.updateAuctionProduct = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const requestUUID = request.params.uuid
        const requestName = request.body.name
        const requestGameName = request.body.game_name
        const requestDefaultPrice = request.body.default_price
        const requestDefaultBid = request.body.default_bid
        const requestStartTime = request.body.start_time
        const requestEndTime = request.body.end_time
        const requestInformation = request.body.information
        const requestDescription = request.body.description
        await connection.query('UPDATE auction_product SET name = ? , game_name = ? , default_price = ? , default_bid = ?, start_time = ?, end_time = ? , information = ? , description = ? , update_at = ? WHERE uuid = ? LIMIT 1',
        [requestName, requestGameName, requestDefaultPrice, requestDefaultBid, requestStartTime, requestEndTime, requestInformation, requestDescription, new Date(), requestUUID])
        response.status(200).json({status: true, payload: 'การแก้ไขสินค้าประมูลสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขสินค้าประมูลล้มเหลว'})
        }
    }
}

module.exports.updateBid = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const requestUUID = request.body.uuid
        const requestDefaultPrice = request.body.default_price
        const requestLatestBidder = request.body.latest_bidder
        await connection.query('UPDATE auction_product SET default_price = ?, latest_bidder = ?, update_at = ? WHERE uuid = ?',
        [requestDefaultPrice, requestLatestBidder, new Date(), requestUUID])
        response.status(200).json({status: true, payload: 'การแก้ไขการเสนอราคาสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขการเสนอราคาล้มเหลว'})
        }
    }
}

module.exports.updateAuctionStatus = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const requestUUID = request.params.uuid
        const requestStatus = request.body.auction_status
        if(requestStatus === 0){
            await connection.query('UPDATE auction_product SET auction_status = 1, update_at = ? WHERE uuid = ? LIMIT 1',
            [new Date(), requestUUID])
            response.status(200).json({status: true, payload: 'เปิดสถานะการประมูลสำเร็จ'})
        }else if(requestStatus === 1){
            await connection.query('UPDATE auction_product SET auction_status = 0, update_at = ? WHERE uuid = ? LIMIT 1',
            [new Date(), requestUUID])
            response.status(200).json({status: true, payload: 'ปิดสถานะการประมูลสำเร็จ'})
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

module.exports.deleteAuctionProduct = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{

        const requestUUID = request.params.uuid
        const [results] = await connection.query('SELECT information FROM auction_product WHERE uuid = ?', [requestUUID])
        assert(results.length > 0)
        const information = results[0].information
        await connection.query('DELETE FROM auction_product WHERE uuid = ?', [requestUUID])
        fs.unlinkSync(path.join('./public/images/auction-product', information))
        response.status(200).json({status: true, payload: 'การลบสินค้าประมูลสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การลบสินค้าประมูลล้มเหลว'})
        }
    }
}