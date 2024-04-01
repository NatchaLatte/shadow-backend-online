const mysql = require('mysql2/promise')
const assert = require('assert')
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const storageBanner = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/banner')
    },
    filename: (request, file, callback) => {
        const fileExtension = file.originalname.split('.')[1]
        const fileName = `${uuid.v4()}${Date.now()}${Math.round(Math.random() * 1E9)}.${fileExtension}`
        callback(null, fileName)
        request.on('aborted', () => {
            const fullPath = path.join('./public/images/banner', fileName)
            fs.unlinkSync(fullPath)
        })
    }
})

const upload = multer({
    storage: storageBanner,
    fileFilter: (request, file, callback) => {
        if(file.mimetype === 'image/png'){
            callback(null, true)
        }else{
            callback(new Error('ใช้ได้แค่ไฟล์ .png เท่านั้น'), false)
        }
    }
})

module.exports.bannerInsert = async (request, response) => {
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
                    const requestInformation = request.file.filename
                    await connection.query('INSERT INTO banner (uuid, information) VALUES (?, ?)',
                    [requestUUID, requestInformation])
                    response.status(200).json({status: true, payload: 'การเพิ่มแถบประกาศสำเร็จ'})
                }catch(error){
                    try{
                        fs.unlinkSync(path.join('./public/images/banner', request.file.filename))
                    }catch(error){}finally{
                        if(error.code === 'ECONNREFUSED'){
                            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
                        }else{
                            response.status(200).json({status: false, payload: 'การเพิ่มแถบประกาศล้มเหลว'})
                        }
                    }
                }
            }
        })
    }catch(error){
        try{
            fs.unlinkSync(path.join('./public/images/banner', request.file.filename))
        }catch(error){}finally{
            if(error.code === 'ECONNREFUSED'){
                response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
            }else{
                response.status(200).json({status: false, payload: 'การเพิ่มแถบประกาศล้มเหลว'})
            }
        }
    }
}

module.exports.bannerSelect = async (request, response) => {
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
        const [results] = await connection.query('SELECT uuid, information, create_at, update_at FROM banner')
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

module.exports.bannerUpdate = async (request, response) => {
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
                    const requestUUID = request.body.uuid
                    const requestInformation = request.file.filename
                    const [results] = await connection.query('SELECT information FROM banner WHERE uuid = ?', [requestUUID])
                    assert(results.length > 0)
                    const information = results[0].information
                    fs.unlinkSync(path.join('./public/images/banner', information))
                    await connection.query('UPDATE banner SET information = ?, update_at = ? WHERE uuid = ?',
                    [requestInformation, new Date(), requestUUID])
                    response.status(200).json({status: true, payload: 'การแก้ไขแถบประกาศสำเร็จ'})
                }catch(error){
                    try{
                        fs.unlinkSync(path.join('./public/images/banner', request.file.filename))
                    }catch(error){}finally{
                        if(error.code === 'ECONNREFUSED'){
                            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
                        }else{
                            response.status(200).json({status: false, payload: 'การแก้ไขแถบประกาศล้มเหลว'})
                        }
                    }
                }
            }
        })
    }catch(error){
        try{
            fs.unlinkSync(path.join('./public/images/banner', request.file.filename))
        }catch(error){}finally{
            if(error.code === 'ECONNREFUSED'){
                response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
            }else{
                response.status(200).json({status: false, payload: 'การแก้ไขแถบประกาศล้มเหลว'})
            }
        }
    }
}

module.exports.bannerDelete = async (request, response) => {
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
        const [results] = await connection.query('SELECT information FROM banner WHERE uuid = ?', [requestUUID])
        assert(results.length > 0)
        const information = results[0].information
        await connection.query('DELETE FROM banner WHERE uuid = ?', [requestUUID])
        fs.unlinkSync(path.join('./public/images/banner', information))
        response.status(200).json({status: true, payload: 'การลบแถบประกาศสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การลบแถบประกาศล้มเหลว'})
        }
    }
}