const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const assert = require('assert')

let verifyOTP = ''
module.exports.sendOTP = async (request, response) => {
    try{
        const OTP_LENGTH = 6
        const email = request.body.email
        const SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME= process.env.SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME
        const SIMPLE_MAIL_TRANSFER_PROTOCOL_PASSWORD= process.env.SIMPLE_MAIL_TRANSFER_PROTOCOL_PASSWORD
        const OTP = otpGenerator.generate(OTP_LENGTH, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME,
                pass: SIMPLE_MAIL_TRANSFER_PROTOCOL_PASSWORD
            }
        })
        const verify = await transporter.verify()
        assert(verify)
        const mailOptions = {
            from: `"SHADOW" ${SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME}`,
            to: `${email}`,
            subject: `[SHADOW] โปรดตรวจสอบรหัส OTP`,
            text: `รหัส OTP ของคุณคือ ${OTP}`
        }
        await transporter.sendMail(mailOptions)
        verifyOTP = OTP
        response.status(200).json({'status': true, 'message': 'กรุณาตรวจสอบอีเมล'})
    }catch(error){
        response.status(500).json({'status': false, 'message': 'สมัครสมาชิกไม่สำเร็จ'})
    }
}

module.exports.reciveOTP = (request, response) => {
    try{
        const recivedOTP = request.body.recivedOTP
        assert(recivedOTP === verifyOTP)
        response.status(200).json({'status': true, 'message': 'ยืนยัน OTP สำเร็จ'})
    }catch(error){
        response.status(200).json({'status': false, 'message': 'รหัส OTP ไม่ถูกต้อง'})
    }
}