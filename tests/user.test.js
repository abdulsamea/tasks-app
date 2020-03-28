const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

//dummy user to be created for access by other apis which require a user

const userDummy = {
    name: 'dum',
    email: 'abdulsamea2@gmail.com',
    password: '123456'
}

//clear db on each test run to avoid errors like rerun of user creation test which fails with 'already created' error
beforeEach(async () => {
    await User.deleteMany()
    //save dummy user
    await new User(userDummy).save()
})

//test user creation
test('Should add a new user', async () => {
        await request(app).post('/users').send({
            name: 'Sam',
            email: 'a@b.com',
            password: '123456',
            age: 18 
        }).expect(201)
})

//test user login
test('Should login a user', async () => {
    await request(app).post('/users/login').send({
        email: 'abdulsamea2@gmail.com',
        password: '123456'
    }).expect(200)
})

//test for wrong credentials
test('Should reject an illegal user', async () => {
    await request(app).post('/users/login').send({
        email: 'abdulsamea@gmail.com',
        password: '1234562'
    }).expect(400)
})
