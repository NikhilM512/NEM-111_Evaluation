
const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1]
    // console.log(token,req.headers.authorization)
    if(token){
        const decoded = jwt.verify(token, 'hush')
        console.log(decoded)
        if(decoded){
            const userID = decoded.userID
            req.body.userID = userID
            next()
        }
        else{
            res.send("Please login")
        }  
    }
    else{
        res.send("Please login")
    }
}


module.exports = {authenticate}