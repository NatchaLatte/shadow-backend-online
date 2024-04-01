const mysql = require('mysql2/promise')
const assert = require('assert')

module.exports.validateRedeemCode = async (request, response) => {
    const connection = await mysql.createConnection({
        host        : process.env.DATABASE_HOST,
        user        : process.env.DATABASE_USER,
        password    : process.env.DATABASE_PASSWORD,
        database    : process.env.DATABASE_NAME
    })
    try{
        const requestGameName = Object.keys(request.body)[0]
        const requestRedeemCode = Object.values(request.body)[0]
        const [resultsStoreProduct] = await connection.query('SELECT uuid, method_uuid FROM store_product WHERE used_status = 0 AND game_name = ? AND uuid = ?',
        [requestGameName, requestRedeemCode])
        assert(resultsStoreProduct.length > 0)
        const uuid = resultsStoreProduct[0].uuid
        const method_uuid = resultsStoreProduct[0].method_uuid
        const [resultsGeneralProduct] = await connection.query('SELECT product_id FROM general_product WHERE uuid = ?', [method_uuid])
        const [resultsGachaProduct] = await connection.query('SELECT product_id FROM gacha_product WHERE uuid = ?', [method_uuid])
        const [resultsAuctionProduct] = await connection.query('SELECT product_id FROM auction_product WHERE uuid = ?', [method_uuid])
        assert(resultsGeneralProduct.length+resultsGachaProduct.length+resultsAuctionProduct.length > 0)
        let product_id = 'ไม่มีสินค้า'
        if(resultsGeneralProduct.length === 1){
            product_id = resultsGeneralProduct[0].product_id
        }else if(resultsGachaProduct.length === 1){
            product_id = resultsGachaProduct[0].product_id
        }else if(resultsAuctionProduct.length === 1){
            product_id = resultsAuctionProduct[0].product_id
        }
        await connection.query('UPDATE `store_product` SET used_status = ?, update_at = ? WHERE uuid = ?',
        [true, new Date(), uuid])
        response.status(200).json({status: true, payload: product_id})
    }catch(error){
        if(error.code === 'ECONNREFUSED'){
            response.status(200).json({status: false, payload: 'เกิดข้อผิดพลาดขึ้นในการเชื่อมต่อกับฐานข้อมูล'})
        }else{
            response.status(200).json({status: false, payload: 'ตรวจสอบความถูกต้องของข้อมูลล้มเหลว'})
        }
    }
}