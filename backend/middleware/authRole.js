const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json({ err: "Not access"})
    : next();





module.exports = checkRole