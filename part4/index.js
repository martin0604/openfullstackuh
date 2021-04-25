const http = require('http')
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger'); //Method imported from utils/logger.js file for logging

const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
