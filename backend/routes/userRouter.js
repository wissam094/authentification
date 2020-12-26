const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth= require("../middleware/auth")
const User = require("../models/userModel");


router.post("/register", async (req, res) => {
 try{
    let { email, password, passwordCheck, displayName } = req.body;
  // validate

  if (!email || !password || !passwordCheck)
  return res.status(400).json({ msg: "Not all fields have been entered." });
  if (password.length < 5)
    return res
      .status(400)
      .json({ msg: "The password needs to be at least 5 characters long." });
  if (password !== passwordCheck)
    return res
      .status(400)
      .json({ msg: "Enter the same password twice for verification." });

  const existingUser = await User.findOne({ email: email });

  if (existingUser)
    return res
      .status(400)
      .json({ msg: "An account with this email already exists." });

  if (!displayName) displayName = email;

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser =new User ({
    email,
    password: passwordHash,
    displayName,
  });
  const savedUser = await newUser.save();
  res.json(savedUser);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // route LOGIN User
router.post("/login",
async (req, res)=>{
  try{
const {email,password}=req.body;
const roleu='user';
// validate
if (!email || !password)
return res.status(400).json({ msg: "Not all fields have been entered." });

const user=await User.findOne({email: email});
if (!user)
return res.status(400).json({ msg: "Not no account with this email has been regestred." });
if (user.roleType !== roleu) {
  return res.status(403).json({
      msg: "Please make sure you are logging in from the right portal.",
  });
}
const ismatch= await bcrypt.compare(password, user.password);
if (!ismatch)
return res.status(400).json({ msg: "invaild credentials" });


const token=jwt.sign({id: user._id}, process.env.JWT_SECRET) ;
res.json({
  token,
  user:{
    id:user._id,
    displayName: user.displayName,
  
  },
})
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})


    /*// route LOGIN-Admin
    router.post("/admin",async (req , res)=>{
      try{
    const {email,password}=req.body;
    const role='admin';
    // validate
    if (!email || !password)
    return res.status(400).json({ msg: "Not all fields have been entered." });
    
    const user=await User.findOne({email: email});
    if (!user)
    return res.status(400).json({ msg: "Not no account with this email has been regestred." });
   
    if (user.roleType== role) {
      return res.status(400).json({
          msg: "Please make sure you are logging in from the right portal.",
      });
    }
    const ismatch= await bcrypt.compare(password, user.password);
    if (!ismatch)
    return res.status(400).json({ msg: "invaild credentials" });
 
    
    const token=jwt.sign({id: user._id}, process.env.JWT_SECRET) ;
    res.json({
      token,
      user:{
        id:user._id,
        displayName: user.displayName,
      
      },
    })
      }
      catch (err) {
        res.status(500).json({ error: err.message });
      }
    })*/

    // route Delete
router.delete('/delete',auth, async (req,res)=>{
try {
const deleteUser= await User.findByIdAndDelete(req.user);
res.json(deleteUser);
}
catch (err) {
  res.status(500).json({ error: err.message });
}
}) 

// route verfication
router.post('/valid',async (req,res)=>{
  const token= req.header("x-auth-token");
       if (!token) return res.json(false);
  const verfied=jwt.verify(token, process.env.JWT_SECRET);
       if (!verfied)  return res.json(false);   
  const user= await User.findById(verfied.id)
       if (!user) return res.json(false);
  return res.json(true);
})

router.get('/',auth, async (req, res)=>{
  const user=await User.findById(req.user);
  res.json({displayName: user.displayName,
    id: user._id,});
})



module.exports=router;