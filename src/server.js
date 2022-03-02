import express from 'express';  //Importing express package ---> npm i express
import listEndpoints from 'express-list-endpoints';     //Importing listEndpoints package ---> npm i express-list-endpoints
import authorsRouter from './services/authors/index.js';
import blogPostsRouter from './services/blogPosts/index.js'


import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"

const server = express();

const port = 3001;

server.use(express.json()); // If we don't add this configuration to our server (BEFORE the endpoints), all requests' bodies will be UNDEFINED

server.use("/authors", authorsRouter);

server.use("/blogPosts", blogPostsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })