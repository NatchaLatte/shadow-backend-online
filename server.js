const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const bodyParser = require("body-parser")
const express = require('express')
const morgan = require('morgan')
dotenv.config({ path: path.join(__dirname, 'server.env') })
const corsOptions = {
    'origin': '*',
    'credentials': true,
}
const logRedeemCode = require('./routes/log-redeem-code-route')
const app = express()

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/api', logRedeemCode)

const port = process.env.PORT || 3001
const server = app.listen(port, () => {
    console.log(`เปิดเซิร์ฟเวอร์ด้วยพอร์ต ${port} สำเร็จ`)
    console.log(`ที่อยู่เซิร์ฟเวอร์ http://shadow.serveminecraft.net:${port}/`)
})
server.on('error', (error) => {
    console.error(`เปิดเซิร์ฟเวอร์ด้วยพอร์ต ${error.address} ล้มเหลว`)
    server.close(() => {
        console.error('เซิร์ฟเวอร์ปิดตัวลงเรียบร้อย')
    })
})