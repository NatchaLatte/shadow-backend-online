const mysql = require('mysql2/promise')
const jsonwebtoken = require('jsonwebtoken')
const SECRET = process.env.SECRET
const assert = require('assert')
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

const storageAvatar = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/avatar')
    },
    filename: (request, file, callback) => {
        const fileExtension = file.originalname.split('.')[1]
        const fileName = `${uuid.v4()}${Date.now()}${Math.round(Math.random() * 1E9)}.${fileExtension}`
        callback(null, fileName)
        request.on('aborted', () => {
            const fullPath = path.join('./public/images/avatar', fileName)
            fs.unlinkSync(fullPath)
        })
    }
})

const upload = multer({
    storage: storageAvatar,
    fileFilter: (request, file, callback) => {
        if(file.mimetype === 'image/png'){
            callback(null, true)
        }else{
            callback(new Error('ใช้ได้แค่ไฟล์ .png เท่านั้น'), false)
        }
    }
})

module.exports.validationAccount = (request, response) => {
    try{
        const atLeastOneUppercase = /[A-Z]/g
        const atLeastOneLowercase = /[a-z]/g
        const atLeastOneNumeric = /[0-9]/g
        const atLeastOneSpecialChar = /[#?!@$%^&*-]/g
        const eightCharsOrMore = /.{8,}/g
        const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
        const requestEmail = request.body.email
        const requestUsername = request.body.username
        const requestPassword = request.body.password
        const requestConfirmPassword = request.body.confirmPassword
        assert(requestUsername.length > 0, 'กรุณากรอกนามแฝง')
        assert(requestEmail.length > 0, 'กรุณากรอกอีเมล')
        assert(requestPassword.length > 0, 'กรุณากรอกรหัสผ่าน')
        assert(requestConfirmPassword.length > 0, 'กรุณายืนยันรหัสผ่าน')
        assert(requestEmail.match(emailRegex), 'กรุณากรอกรูปแบบอีเมลให้ถูกต้อง')
        assert(requestPassword.match(eightCharsOrMore), 'ต้องการความยาวรหัสผ่านอย่างน้อย 8 ตัว')
        assert(requestPassword.match(atLeastOneLowercase), 'ต้องการตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว')
        assert(requestPassword.match(atLeastOneUppercase), 'ต้องการตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว')
        assert(requestPassword.match(atLeastOneNumeric), 'ต้องการตัวเลขอย่างน้อย 1 ตัว')
        assert(requestPassword.match(atLeastOneSpecialChar), 'ต้องการตัวอักษรพิเศษอย่างน้อย 1 ตัว')
        assert(requestPassword === requestConfirmPassword, 'กรุณากรอกรหัสผ่าน และ ยืนยันรหัสผ่านให้ตรงกัน')
        response.status(200).json({status:true, payload: 'ผ่านการตรวจสอบ'})
    }catch(error){
        response.status(200).json({status:false, payload: error.message})
    }
}

const getDefaultAvatar = (requestUsername) => {
    const avatarName = requestUsername.at(0).toLowerCase()
    if(avatarName !== requestUsername.at(0).toUpperCase()){
        return `${avatarName}.png`
    }else{
        return 'default.png'
    }
}

module.exports.signUpAccount = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const requestEmail = request.body.email
        const requestUsername = request.body.username
        const requestAvatar = getDefaultAvatar(requestUsername)
        await connection.query('INSERT INTO account (email, username, avatar) VALUES (?, ?, ?)',
        [requestEmail, requestUsername, requestAvatar])
        await connection.query('INSERT INTO finance (email) VALUES (?)',
        [requestEmail])
        response.status(200).json({status: true, payload: 'การสร้างบัญชีสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การสร้างบัญชีล้มเหลว'})
        }
    }finally {
        await connection.end();
    }
}

module.exports.signInAccount = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const requestEmail = request.body.email
        const [results] = await connection.query('SELECT email, suspended_status, role FROM account WHERE email = ?',
        [requestEmail])
        assert(results.length !== 0, 'ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง')
        assert(results.length === 1, 'การเข้าสู่ระบบล้มเหลว')
        assert(results[0].suspended_status === 0, 'บัญชีนี้ถูกระงับ')
        const token = jsonwebtoken.sign({email: results[0].email}, SECRET, { expiresIn: '1h' })
        response.cookie('token', token, {
            maxAge: 3600000,
            secure: true,
            httpOnly: true,
            sameSite: 'none',
        })
        response.status(200).json({status: true, payload: token})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else if(error.code === 'ERR_ASSERTION'){
            response.status(200).json({status: false, payload: error.message})
        }else{
            console.log(error)
            response.status(200).json({status: false, payload: 'การเข้าสู่ระบบล้มเหลว'})
        }
    }finally {
        await connection.end();
    }
}

module.exports.authenticationAccount = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const token = request.cookies.token
        const decoded = jsonwebtoken.verify(token, SECRET)
        const requestEmail = decoded.email
        const [resultsAccount] = await connection.query('SELECT email, username, avatar, role, gacha_count FROM account WHERE email = ?',
        [requestEmail])
        assert(resultsAccount.length === 1)
        const [resultsFinance] = await connection.query('SELECT aysel_amount FROM finance WHERE email = ?',
        [requestEmail])
        assert(resultsFinance.length === 1)
        resultsAccount[0].aysel_amount = resultsFinance[0].aysel_amount
        response.status(200).json({status: true, payload: resultsAccount[0]})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else if(error.code === 'ERR_ASSERTION'){
            response.status(200).json({status: false, payload: error.message})
        }else{
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดที่ไม่รู้จัก'})
        }
    }finally {
        await connection.end();
    }
}

module.exports.signOutAccount = (request, response) => {
    response.cookie('token', null, {
        maxAge: 0,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
    })
    response.status(200).json({status: false, payload: {}})
}

module.exports.selectAccount = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const [results] = await connection.query('SELECT email, username, suspended_status, role FROM account')
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแสดงข้อมูลล้มเหลว'})
        }
    }finally {
        await connection.end();
    }
}

module.exports.updateStatusAccount = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const requestEmail = request.params.email
        const requestStatus = request.body.suspended_status
        if(requestStatus === 0){
            await connection.query('UPDATE account SET suspended_status = 1, update_at = ? WHERE email = ? LIMIT 1',
            [new Date(), requestEmail])
            response.status(200).json({status: true, payload: 'ระงับผู้ใช้สำเร็จ'})
        }else if(requestStatus === 1){
            await connection.query('UPDATE account SET suspended_status = 0, update_at = ? WHERE email = ? LIMIT 1',
            [new Date(), requestEmail])
            response.status(200).json({status: true, payload: 'ปลดระงับผู้ใช้สำเร็จ'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขสถานะล้มเหลว'})
        }
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขสถานะล้มเหลว'})
        }
    }finally {
        await connection.end();
    }
}

module.exports.updateUsername = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const requestEmail = request.params.email
        const requestUsername = request.body.username
        await connection.query('UPDATE account SET username = ?, update_at = ? WHERE email = ?',
        [requestUsername, new Date(), requestEmail])
        response.status(200).json({status: true, payload: 'การแก้ไขชื่อสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขชื่อล้มเหลว'})
        }
    }finally {
        await connection.end();
    }
}

module.exports.updateAvatar = async (request, response) => {
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
                    const token = request.cookies.token
                    jsonwebtoken.verify(token, SECRET)
                    const requestEmail = request.body.email
                    const requestAvatar = request.file.filename
                    const [results] = await connection.query('SELECT avatar FROM account WHERE email = ?',
                    [requestEmail])
                    assert(results.length > 0)
                    const information = results[0].avatar
                    fs.unlinkSync(path.join('./public/images/avatar', information))
                    await connection.query('UPDATE account SET avatar = ?, update_at = ? WHERE email = ?',
                    [requestAvatar, new Date(), requestEmail])
                    response.status(200).json({status: true, payload: 'การแก้ไขรูปภาพโปรไฟล์สำเร็จ'})
                }catch(error){
                    try{
                        fs.unlinkSync(path.join('./public/images/avatar', request.file.filename))
                    }catch(error){}
                    finally{
                        if(error.code === 'ECONNREFUSED'){
                            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
                        }else{
                            response.status(200).json({status: false, payload: 'การแก้ไขรูปภาพโปรไฟล์ล้มเหลว'})
                        }
                    }
                }
            }
        })
    }catch(error){
        try{
            fs.unlinkSync(path.join('./public/images/avatar', request.file.filename))
        }catch(error){}finally{
            if(error.code === 'ECONNREFUSED'){
                response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
            }else{
                response.status(200).json({status: false, payload: 'การแก้ไขรูปภาพโปรไฟล์ล้มเหลว'})
            }
        }
    }finally {
        await connection.end();
    }
}

module.exports.updateGachaCount = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const requestEmail = request.params.email
        const requestGachaCount = request.body.gacha_count
        await connection.query('UPDATE account SET gacha_count = ?, update_at = ? WHERE email = ?',
        [requestGachaCount, new Date(), requestEmail])
        response.status(200).json({status: true, payload: 'การแก้ไขจำนวนกาชาสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขจำนวนกาชาล้มเหลว'})
        }
    }finally {
        await connection.end();
    }
}