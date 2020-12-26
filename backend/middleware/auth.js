const jwt=require("jsonwebtoken");

const auth = async (req, res, next)=> {
    try{
const token= req.header("x-auth-token");
if(!token)
return res.status(401).json({msg: "No authentifcation token, authorziation dinied"})

const verfied=jwt.verify(token, process.env.JWT_SECRET);
if (!verfied)
return res.status(401).json({ err: "token verfication failed, authorzation dinied"});

req.user = verfied.id;
next();
}
catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports=auth;