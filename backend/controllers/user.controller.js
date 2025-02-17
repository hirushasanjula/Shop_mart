import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import sendEmail from '../config/sendEmail.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import generatedOtp from '../utils/generatedOTP.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken'

export async function registerUserController(req, res) {
    try {
        const { name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if(user) {
            return res.status(400).json({
                message: 'User already exists',
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const VerifyEmailUrl = `${process.env.FRONTEND_UR}/verify-email?code=${save?._id}`;

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: 'Verify Email from Shopmart',
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })

        return res.json({
            message: 'User registered successfully',
            error: false,
            success: true,
            data: save
        })

    } catch (error) {
       return res.status(500).json({
        message: error.message || error,
        error: true,
        success: false
       });
    }
}

export async function verifyEmailController(req, res) {
    try {
        const {code} = req.body

        const user = await UserModel.findOne({ _id: code });

        if(!user) {
            return res.status(400).json({
                message: 'Invalid code',
                error: true,
                success: false
            });
        }

        const updateUser = await UserModel.updateOne({ _id: code }, { verify_email: true });

        return res.json({
            message: 'Email verified successfully',
            error: false,
            success: true,
            data: updateUser
        })

    } catch (error) {
        return res.response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })
    }
}

//login 
export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if(!user) {
            return res.status(400).json({
                message: 'User not registered',
                error: true,
                success: false
            });
        }

       if(user.status !== "Active") {
        return res.status(400).json({
            message: 'Contact admin to activate your account',
            error: true,
            success: false
        });
       }

       const checkPassword = await bcryptjs.compare(password, user.password);

       if(!checkPassword) {
        return res.status(400).json({
            message: 'Check your password',
            error: true,
            success: false
        });
       }

       const accesstoken = await generatedAccessToken(user._id);
       const refreshtoken = await generatedRefreshToken(user._id);

       const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
        last_login_date : new Date()
       })

       const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
       }

       res.cookie('accesstoken', accesstoken,cookieOption)
       res.cookie('refreshtoken', refreshtoken,cookieOption)

       return res.json({
           message: 'User logged in successfully',
           error: false,
           success: true,
           data: {
                accesstoken,
                refreshtoken
           }
       })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })    
    }
}

//logout
export async function logoutController(req, res) {
    try {

        const userId = req.userId;

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
       }
        res.clearCookie('accesstoken'   ,cookieOption);
        res.clearCookie('refreshtoken',cookieOption);

       const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
              refresh_token: ''
       })
           
        return res.json({
            message: 'User logged out successfully',
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })     
    }
}

//upload user avatar
export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId
        const image = req.file

        const upload = await uploadImageCloudinary(image)

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return res.json({
            message: 'Image uploaded successfully',
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//update user details
export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId;
        const { name, email, mobile, password} = req.body;

        let hashPassword = ""

        if(password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        }

        const updateUser = await UserModel.updateOne({_id :userId}, {
            ...(name && {name: name}),
            ...(email && {email: email}),
            ...(mobile && {mobile: mobile}),
            ...(password && {password: hashPassword})
        })

        return res.json({
            message: 'User updated successfully',
            error: false,
            success: true,
            data: updateUser
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//forgot password not logging
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({email})

        if(!user) {
            return res.status(400).json({
                message: 'Email not available',
                error: true,
                success: false
            });
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000;

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expriy: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: 'Forgot Password shopmart',
            html: forgotPasswordTemplate({
                name: user.name,
                otp : otp
            })
        })

        return res.json({
            message: 'OTP sent to your email',
            error: false,
            success: true,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//verify forgot password otp
export async function verifyForgotPasswordOtp(req, res) {
    try {
        const {email, otp} = req.body;

        if(!email || !otp) {
            return res.status(400).json({
                message: 'Provide required field email, otp.',
                error: true,
                success: false
            });
        }
        const user = await UserModel.findOne({email})

        if(!user) {
            return res.status(400).json({
                message: 'Email not available',
                error: true,
                success: false
            });
        }

        const currentTime = new Date().toISOString();

        if(user.forgot_password_otp_expiry < currentTime) {
            return res.status(400).json({
                message: "Otp is expired",
                error: true,
                success: false
            })
        }

        if(otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: 'Invalid otp',
                error: true,
                success: false
            });
        }

        //if otp is not expired and valid

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: '',
            forgot_password_otp_expiry: ''
        })

        return res.json({
            message: 'Otp verified successfully',
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//reset password
export async function resetpassword(req, res) {
    try {
        const {email, newPassword, confirmPassword} = req.body;

        if(!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: 'Provide required fields email, newPassword, confirmPassword',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({email})

        if(!user) {
            return res.status(400).json({
                message: 'Email not available',
                error: true,
                success: false
            });
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Password does not match',
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        const update = await UserModel.findByIdAndUpdate(user._id, {
            password: hashPassword
        })

        return res.json({
            message: 'Password reset successfully',
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//refresh token
export async function refreshToken(req,res) {
    try {
        const refreshtoken = req.cookies.refreshtoken || req?.headers?.authorization?.split(" ")[1]

        if(!refreshtoken) {
            return res.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshtoken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken) {
            return res.status(401).jason({
                message: "token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
       }

        res.cookie('accesstoken', newAccessToken,cookieOption)

        return res.json({
            message: 'New access token generated',
            error: false,
            success: true,
            data: {
                accesstoken: newAccessToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// get login user details
export async function userDetails(req, res) {
    try {
        const userId = req.userId

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return res.json({
            message: 'User details',
            error: false,
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false
        })
    }
}