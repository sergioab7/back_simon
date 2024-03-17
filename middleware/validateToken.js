import jwt from "jsonwebtoken";

export const authRequired = (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);

    if(!token){
        return res.status(500).json({
            status:"Error",
            message:"[-] No existe el token!"
        })
    }
    
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({
                status:"Error",
                message:"[-] Token inválido"
            })
        }
        req.user = decoded.id;

    })

    next();

}