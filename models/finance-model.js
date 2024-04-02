const mysql = require('mysql2/promise')

module.exports.updateAysel = async (request, response) => {
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
        const requesEmail = request.body.email
        const requestAyselAmount = request.body.aysel_amount
        await connection.query('UPDATE finance SET aysel_amount = ?, update_at = ? WHERE email = ?',
        [requestAyselAmount, new Date(), requesEmail])
        connection.end()
        response.status(200).json({status: true, payload: 'การแก้ไขจำนวนไอเอซสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การแก้ไขจำนวนไอเซลล้มเหลว'})
        }
    }
}