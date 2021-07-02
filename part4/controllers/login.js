const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res) => { //Exercise 4.18 route for implementing token based authentication
    const body = req.body;

    const user = await User.findOne({ username: body.username });
    console.log("usuario encontrado", user);
    const passwordCorrect = 
    user === null 
    ? false 
    : await bcrypt.compare(body.password, user.password);

    if(!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password'
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET);
    res.status(200).send({token, username: user.username, name: user.name});
});

module.exports = loginRouter;