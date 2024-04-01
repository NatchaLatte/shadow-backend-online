const mysql = require('mysql2/promise')
const uuid = require('uuid')

module.exports.readRedeemCode = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const [results] = await connection.query('SELECT * FROM game_product')
        response.status(200).json({status: true, payload: results})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การดึงข้อมูลล้มเหลว'})
        }
    }
}

module.exports.logRedeemCode = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const requestUUID = uuid.v4()
        const requestGameName = Object.keys(request.body)[0]
        const requestGameProducts = Object.values(request.body)[0]
        await connection.query('DELETE FROM game_name WHERE game_name = ?', [requestGameName])
        await connection.query('INSERT INTO game_name (uuid, game_name) VALUES (?, ?)', [requestUUID, requestGameName])
        await connection.query('DELETE FROM game_product WHERE game_name = ?', [requestGameName])
        for(let index = 0; index < requestGameName.length; ++index){
            const requestGameProduct = requestGameProducts[index]
            if(requestGameProduct !== undefined){
                await connection.query('INSERT INTO game_product (uuid, product_id, game_name, name, description) VALUES (?, ?, ?, ?, ?)',
                [uuid.v4(), requestGameProduct.product_id, requestGameName, requestGameProduct.name, requestGameProduct.description])
            }
        }
        response.status(200).json({status: true, payload: 'การบันทึกข้อมูลของเกมสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การบันทึกข้อมูลของเกมล้มเหลว'})
        }
    }
}