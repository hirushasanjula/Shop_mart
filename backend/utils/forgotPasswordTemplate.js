const forgotPasswordTemplate = ({name, otp}) => {
    return `
        <div style="font-family: Arial, 'sans-serif'; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2>Dear, ${name},</h2>
        <p>You requested for a password reset, kindly use the OTP below to reset your password</p>
        <h3 style="background-color: #f8f8f8; padding: 10px; font-size: 24px; border-radius: 5px;">${otp}</h3>
        <p>If you did not request a password reset, kindly ignore this email</p>
        <br/>
        </br>
        <p>Best Regards</p>
        <p>Shopmart</p>`
}

export default forgotPasswordTemplate;