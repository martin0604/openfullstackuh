const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

//Route handler for GET request, to retrieve all Posts from database
blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
    /*Blog.find({}).then(blogs => {
        res.json(blogs);
    })*/
});

//Route handler for POST request to save a Post
blogsRouter.post('/', (req, res) => {
    const body = req.body;

    if(!body.title && !body.url){
        res.status(400).send('Bad Request');
    } else{

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    });
    
    try{
        blog
          .save()
          .then(result =>{
              res.status(201).json(result);
          });
    } catch(exception){
        next(exception);
    }
    }
});

//Route handler for DELETE Request, used to delete a resource
blogsRouter.delete('/:id',async (req, res, next) => {
    let id = req.params.id;
    try{
        let resultado = await Blog.findByIdAndRemove(id);
        console.log(resultado);
        res.status(204).end();
    } catch(error){
        next(error);
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