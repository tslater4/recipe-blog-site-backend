const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // payload didnt work so im just making this a direct assignment
        next();
    } catch (error) {
        res.status(401).json({ err: "Invalid token" });
    }
};

module.exports = verifyToken;
