const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    // Get the user from jwt token and add id to request object
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using credentials" })
    }
    try {
        const data = jwt.verify(token, process.env.JWT_KEY); 
        req.user = data.user;
        next();
    } catch (err) {
        res.status(401).send({ error: "Please authenticate using valid credentials" })
    }
}

module.exports = fetchuser;