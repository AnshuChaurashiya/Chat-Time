const jwt  = require('jsonwebtoken')
const UserModel = require('../model/User.models')


 const ProctectRoute = async (req, res , next) => {
    try {

        const token = req.headers.token;
        const decoded = jwt.verify(token,
            process.env.JWT_SECRET
        )

        const user = await UserModel.findById(decoded.userId).select("-password")

        if(!user)
            return res.status(401).json({
           success: false, 
           message: "User not found"
        })
        req.user = user
        next()
        
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token"
            })
        
    }


}

 const CheckAuth = (req, res) => {
    if(!req.user)
        return res.status(401).json({
            success: false,
            message: "You are not authenticated"
        })
    
    res.json({
        success: true,
        user: req.user,
        message: "Authentication successful"
    });
}
module.exports = {ProctectRoute, CheckAuth}