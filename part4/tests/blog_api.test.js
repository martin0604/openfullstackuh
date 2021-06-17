const { TestScheduler } = require('@jest/core');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');

const Blog = require('../models/blog');

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
});

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
});

//Test for exercise 4.9
test('id blog property is defined', async () => { 

    const response = await api.get('/api/blogs'); //Send a get request to the /api/blog endpoint to get the list of all blog posts
    let blogPosts = response.body; //Assign the value of blogPosts to be the body of the response.
    //blogPosts.push({title: 'test', author:'test', likes: 4});
    blogPosts.forEach(blog => { //Check that every blog in the collection(array of objects) has an id property
        expect(blog.id).toBeDefined();
    });

});

//Test for exercise 4.10
test('creation of a new blog post in database', async () => {
    let response = await api.get('/api/blogs'); //Obtener blogs
    let currentNumPosts = response.body.length; //get current number of blog posts
    
    const newPost = { //New post object to be created in database
        "title": "Translating from english to spanish",
        "author": "Ana Cecilia Perea",
        "url": "https://www.google.com.co",
        "likes": 6
    }

    //Enviar peticion post con objeto newPost para crear nueva publicacion de blog en base de datos
    await api.post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    
    const postsAfterCreation = await api.get('/api/blogs');
    const contents = postsAfterCreation.body.map(p => p.title);
    expect(postsAfterCreation.body).toHaveLength(currentNumPosts + 1);
    expect(contents).toContain('Translating from english to spanish');


});

//Test for exercise 4.11
test('if likes property is missing set it as zero', async () => {
    
    const newPost = { //New post object to be created in database without 'likes' property
        "title": "The bourne legacy review",
        "author": "Peter Bradshaw",
        "url": "https://www.theguardian.com/film/2012/aug/09/the-bourne-legacy-review",
    }
    
    //Send post request with the newPost object
    await api.post('/api/blogs')
    .send(newPost)
    .expect(201)

});

//Test for exercise 4.12
test('if no url and title, respond with 400 status code', async () => {
    const newPost = { //New post object to be created in database without 'likes' property
        "author": "Stuard Jeffries"
    }
    await api.post('/api/blogs')
    .send(newPost)
    .expect(400)
});

//test for exercise 4.13
test('Delete a single blog post resource', async () => {
    const blogPosts = await api.get('/api/blogs');
    const postToDelete = blogPosts.body[0];

    //Delete the first post from the retrieved list
    await api.delete(`/api/blogs/${postToDelete.id}`)
    .expect(204);

    //Check if there is one less post when querying all blog posts from database
    const postsAtEnd = await api.get('/api/blogs');
    expect(postsAtEnd.body).toHaveLength(blogPosts.body.length - 1);
});

//test for exercise 4.14
test('Update info for an individual blog post', async () =>{
    const BlogPosts = await api.get('/api/blogs');
    const postToUpdate = BlogPosts.body[0];

    const newPostInfo = {
        "title": "Python basics",
        "author": "Al Sweigart",
        "url": "https://automatetheboringstuff.com/2e/chapter1/",
        "likes": 8
    }

    //Update the first post
    await api.put(`/api/blogs/${postToUpdate.id}`)
    .send(newPostInfo)
    .expect(204);

});

afterAll(() => {
    mongoose.connection.close()
});