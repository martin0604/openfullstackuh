const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

//Route for creating a user, exercise 4.15
usersRouter.post('/', async (req, res) => {
    const body = req.body;

    if(!body.username || !body.password){
        res.status(400).send('Bad request, username or password not given.');
    } else {
        if(body.password.length < 3){
            res.status(409).send('Conflict, password must be at least three characters long.');
        } else{
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(body.password, saltRounds);

            const user = new User({
                username: body.username,
                name: body.name,
                password: passwordHash
            });

            const savedUser = await user.save();
            res.json(savedUser);
        }
    }
});

//Route for listing users, exercise 4.15
usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs');
    res.json(users);
});

module.exports = usersRouter;
