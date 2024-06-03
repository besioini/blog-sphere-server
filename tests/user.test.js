const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const User = require('../models/User');
require('dotenv').config();

let mongoServer;

// This line creates a new in-memory MongoDB server instance and assigns it to the mongoServer variable. connects Mongoose to the in-memory MongoDB server using the URI provided by mongoServer.getUri(). 
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri())
});

// // This line deletes all documents from the User collection. It ensures that the database is clean and does not retain any data between tests, preventing tests from interfering with each other.
afterEach(async () => {
    await User.deleteMany({});
});

// This line disconnects Mongoose from the in-memory MongoDB server and stops the in-memory MongoDB server, releasing any resources it was using.
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
})

// Each test case uses the supertest library to send HTTP requests to the Express app, supertest is a library that makes it easy to test HTTP endpoints. The Express app is imported, allowing the tests to send requests to it.

describe('User Registration and Login', () => {
    const user = {
        firstname: 'John',
        lastname: 'Doe',
        contact: 'joe.doe@example.com',
        password: 'pass123//WORD',
        DOB: '1990-01-01',
        gender: 'male'
    };

    describe('Register endpoints', () => {
        it('should register a new user', async () => {
            const res = await request(app).post('/api/users/register').send(user);
            console.log(res.statusCode)
            console.log(res.body);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.message).toBe('Register successful');
            expect(res.body.data.user).toHaveProperty('_id');
            expect(res.body.data.user.firstname).toBe(user.firstname);
            expect(res.headers['set-cookie']).toBeDefined();
        })
    })

})