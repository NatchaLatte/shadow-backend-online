module.exports.gameNameInsert = (request, response) => {

}

module.exports.gameNameSelect = (request, response) => {

}

module.exports.gameNameUpdate = (request, response) => {

}

module.exports.gameNameDelete = async (request, response) => {
    try{
        const connection = await mysql.createConnection({
            host        : process.env.DATABASE_HOST,
            user        : process.env.DATABASE_USER,
            password    : process.env.DATABASE_PASSWORD,
            database    : process.env.DATABASE_NAME
        })
        const requestEmail = request.body.email
        const requestGiftTrueMoney = request.body.giftTrueMoney
        const tw = await twApi(requestGiftTrueMoney, process.env.PHONENUMBER_RECIVE_MONEY)
        assert(tw.status.code === 'SUCCESS')
        const baht = tw.data.my_ticket.amount_baht
        await connection.query('UPDATE finance SET cash_amount = cash_amount + ?, aysel_amount = aysel_amount + ?, update_at = ? WHERE email = ?',
        [baht, (process.env.AYSEL_CURRENCY/process.env.BAHT_CURRENCY)*baht, new Date(), requestEmail])
        await connection.query('INSERT INTO history_payment (uuid, email, aysel_amount, cash_amount, payment_status, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uuid.v4(), requestEmail, (process.env.AYSEL_CURRENCY/process.env.BAHT_CURRENCY)*baht, baht, true, new Date(), new Date()])
        response.status(200).json({status: true, payload: 'การเติมไอเซลสำเร็จ'})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'การเติมไอเซลล้มเหลว'})
        }
    }
}