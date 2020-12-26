const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth= require("../middleware/auth");
const checkRole= require("../middleware/authRole")
const User = require("../models/userModel");

//route Login admin
router.post("/login-admin",async (req, res)=>{})