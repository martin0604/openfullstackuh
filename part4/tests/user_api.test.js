const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const bcrypt = require('bcrypt');

const User = require('../models/user');

beforeEach(async () => {
    await User.deleteMany({});
    
    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({username: 'root', password: passwordHash});
    await user.save();
});

describe('invalid users are not created', () => {

    //Exercise 4.16
    test('creation doesnt succeed if username or password is missing', async () =>{
        const usersAtStart = await helper.usersInDb();
        const newUser ={
            //username: 'mluukkai',
            name: 'Matti Luukaineen'
            //password: 'tktlfullstack'
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);

    });

});