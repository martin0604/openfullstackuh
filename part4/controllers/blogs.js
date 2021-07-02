const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//Route handler for GET request, to retrieve all Posts from database
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user');
    res.json(blogs);
    /*Blog.find({}).then(blogs => {
        res.json(blogs);
    })*/
});

//method to get the token from the request authorization header if it exists
const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
}

//Route handler for POST request to save a Post
blogsRouter.post('/', async (req, res, next) => {
    const body = req.body;
    const token = req.token;
    //const decodedToken = jwt.verify(token, process.env.SECRET);//Exercise 4.19 only allow logged in users to create blog posts
    const userId = req.user; //Get the id of the user from the request object
    if(!token || !userId){
        return res.status(401).json({error: 'token missing or invalid'});
    }
    //Get User by Id
    const user = await User.findById(userId);

    if(!body.title && !body.url){
        res.status(400).send('Bad Request');
    } else{

    //Get list of all users
    //const users = await User.find({});

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id //Assign user id
    });
    
    try{
        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog.id);
        await user.save();
        res.status(201).json(savedBlog);
    } catch(exception){
        console.log(exception)
        next(exception);
    }
    }
});

//Route handler for DELETE Request, used to delete a resource
blogsRouter.delete('/:id',async (req, res, next) => {
    let id = req.params.id;
    //Exercise 4.21, delete blog operation can only be done by the user who added the blog post.
    const token = req.token;
    //const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = req.user;
    if(!token || !userId){
        return res.status(401).json({error: 'token missing or invalid'});
    }

    const blogToDelete = await Blog.findById(id);
    //if(blogToDelete.user.toString() === decodedToken.user.toString()){
        if(blogToDelete.user.toString() === userId.toString()){
        try{
            let resultado = await Blog.findByIdAndRemove(id);
            console.log(resultado);
            res.status(204).end();
        } catch(error){
            next(error);
        }
    } else{
        return res.status(401).json({error: 'Unauthorized. Only the user who created the blog post can delete it.'});
    }

});

//Route handler for PUT request, used to update a resource
blogsRouter.put('/:id', async (req, res, next) => {
    let id = req.params.id;
    const newPostInfo = {
        "title": req.body.title,
        "author": req.body.author,
        "url": req.body.url,
        "likes": req.body.likes
    }

    try{
        let resultado = await Blog.findByIdAndUpdate(id, newPostInfo, {new: true});
        console.log(resultado);
        res.status(204).end();
    }catch(error){
        next(error);
    }
});

module.exports = blogsRouter;