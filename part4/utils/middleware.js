const logger = require('./logger');
const jwt = require('jsonwebtoken');

//Exercise 4.20, use a middleware to extract the authorization token from the authorization header
const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7);
    }
    next();
}

const userExtractor = (req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if(decodedToken.id){
        req.user = decodedToken.id;
    }
    next();
}

const requestLogger = (request, response, next) => {
    logger.info('Method',request.method);
    logger.info('Path: ', request.path);
    logger.info('Body: ', request.body);
    logger.info('---');
    next();
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error:'unknown endpoint'});
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if(error.name === 'CastError'){
        return response.status(400).send({error:'malformatted id'});
    } else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message});
    } else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({error: 'invalid token'});
    }

    next(error);
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}