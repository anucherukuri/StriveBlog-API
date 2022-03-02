import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import uniqid from 'uniqid';
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newBlogPostValidation} from './validation.js';


const blogPostsRouter = express.Router();  // all the endpoints attached to the router will have http://localhost:3001/blogPosts as PREFIX

//  HOW TO GET blogPosts.json PATH ON DISK --> /Users/anusharao/Strive School/Modules/Module 5 - Mastering BackEnd Development/Day 2 - Rest & Express/My Homework/Rest-and-Express/src/services/blogPosts/blogPosts.json

// 1. Starting from current file's path --> /Users/anusharao/Strive School/Modules/Module 5 - Mastering BackEnd Development/Day 2 - Rest & Express/My Homework/Rest-and-Express/src/services/blogPosts/index.js

console.log("CURRENT FILE URL: ",import.meta.url);
const currentFilePath = fileURLToPath(import.meta.url);
console.log("CURRENT FILE PATH: ", currentFilePath);

// 2. From currentFilePath, we can get the parent's folder path 
// /Users/anusharao/Strive School/Modules/Module 5 - Mastering BackEnd Development/Day 2 - Rest & Express/My Homework/Rest-and-Express/src/services/blogPosts

const parentFolderPath = dirname(currentFilePath);
console.log("PARENT FOLDER PATH: ", parentFolderPath);


// 3. Concatenate parentFolderPath with the name of the file 
// --> /Users/anusharao/Strive School/Modules/Module 5 - Mastering BackEnd Development/Day 2 - Rest & Express/My Homework/Rest-and-Express/src/services/blogPosts/blogPosts.json
// NOTE: Normally you would concatenate strings with "+", please don't do that when dealing with paths --> use JOIN instead

const blogPostsJSONPath = join(parentFolderPath, "blogPosts.json");
console.log("BLOGPOSTS JSON PATH: ", blogPostsJSONPath);


const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const writeBlogPosts = content => fs.writeFileSync(blogPostsJSONPath, JSON.stringify(content))


// ***********************----------------------- BLOGPOSTS CRUD -----------------*****************************************************

//******************** CREATE --> POST http://localhost:3001/blogPosts/ (+ body) ******************************

// blogPostsRouter.post("/", newBlogPostValidation,(request, response, next ) => {
//     // 1. Read request body obtaining new blog post's data
//     console.log("BODY: ",request.body); // DO NOT FORGET server.use(express.json()) in server.js

//     // 2. Add some server generated informations (unique id, creation Date, ...)
//     const newBlogPost = { ...request.body,avatar:`https://ui-avatars.com/api/?name=${request.body.name}+${request.body.surname}`,createdAt: new Date, id: uniqid()}    // uniqid is a 3rd party module that generates unique identifiers
//     console.log(newBlogPost);

//     // 3. Read blogPosts.json --> obtaining an array
//     const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath))

//     // 4. Add a new blog post to the array
//     blogPostsArray.push(newBlogPost);

//     // 5. Write the array back to blogPosts.json file
//     fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray))   // we cannot pass an array to this function, but we can pass the stringified version of it

//     // 6. Send a proper response back
//     response.status(201).send(newBlogPost)
// })

//******************** CREATE --> POST http://localhost:3001/blogPosts/ (+ body) (with middlewares)******************************

blogPostsRouter.post("/", newBlogPostValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const newBlogPost = { ...req.body, createdAt: new Date(), id: uniqid() }

      const blogPostsArray = getBlogPosts()

      blogPostsArray.push(newBlogPost)

      writeBlogPosts(blogPostsArray)

      res.status(201).send({ id: newBlogPost.id })
    } else {
      next(createHttpError(400, "Some errors occurred in req body", { errorsList }))
    }
  } catch (error) {
    next(error)
  }
})


//**************** READ --> GET http://localhost:3001/blogPosts/ (+ optional query parameters) ****************

// blogPostsRouter.get("/", (request, response) => {
//     // 1. Read the content of blogPosts.json file
//     const fileContent = fs.readFileSync(blogPostsJSONPath) // You obtain a BUFFER object, which is MACHINE READABLE ONLY
//     console.log("FILE CONTENT: ", JSON.parse(fileContent))
  
//     // 2. Get back an array from the file
//     const blogPostsArray = JSON.parse(fileContent) // JSON.parse() converts BUFFER into a real ARRAY
  
//     // 3. Send back the array as a response
//     response.send(blogPostsArray)
//   })

//**************** READ --> GET http://localhost:3001/blogPosts/ (+ optional query parameters)  (with middlewares)****************


  blogPostsRouter.get("/", (req, res, next) => {
  try {
    // throw new Error("Kaboooooooooooooooooooooooooom!")
    const blogPosts = getBlogPosts()

    if (req.query && req.query.category) {
      const filteredBlogPosts = blgPosts.filter(blogPost => blogPost.category === req.query.category)
      res.send(filteredBlogPosts)
    } else {
      res.send(blogPosts)
    }
  } catch (error) {
    next(error) // next(error) is used to send errors to error handlers!
  }
})

  //****************** READ (single blogPost) --> GET http://localhost:3001/blogPosts/:blogPostId ****************

    // blogPostsRouter.get("/:blogPostId", (request, response) => {
    // console.log("REQ PARAMS: ", request.params.blogPostId)
  
    // // 1. Read the file --> obtaining an array
    // const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath))
  
    // // 2. Find the specific blogPosts by id in the array
    // const foundBlogPost = blogPostsArray.find(blogPost => blogPost.id === request.params.blogPostId)
  
    // // 3. Send a proper response
    // response.status(foundBlogPost?200:404).send(foundBlogPost)
  // })

//**** READ (single blogPost) --> GET http://localhost:3001/blogPosts/:blogPostId  (with middlewares)*******

blogPostsRouter.get("/:blogPostId", (req, res, next) => {
  try {
    const blogPostId = req.params.blogPostId

    const blogPosts = getBlogPosts()

    const foundBlogPost = blogPosts.find(blogPost => blogPost.id === blogPostId)
    if (foundBlogPost) {
      res.send(foundBlogPost)
    } else {
      next(createHttpError(404, `BlogPost with id ${blogPostId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

  //************ UPDATE (single blog post) --> PUT http://localhost:3001/blogPosts/:blogPostId (+ body) *************
  //   blogPostsRouter.put("/:blogPostId", (request, response) => {
  //   // 1. Read the content of the file --> obtaining an array of blogPosts
  //   const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath))
  
  //   // 2. Modify specified blog post into the array by merging previous properties and new properties coming from req.body
  //   const index = blogPostsArray.findIndex(blogPost => blogPost.id === request.params.blogPostId)
  //   const oldBlogPost = blogPostsArray[index]
  //   const updatedBlogPost = { ...oldBlogPost, ...request.body, updatedAt: new Date() }
  
  //   blogPostsArray[index] = updatedBlogPost
  
  //   // 3. Save file back with the updated list of blogPosts
  //   fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray))
  
  //   // 4. Send back a proper response
  //   response.send(updatedBlogPost)
  // })


  blogPostsRouter.put("/:blogPostId", (req, res, next) => {
    try {
      const blogPostId = req.params.blogPostId
  
      const blogPosts = getBlogPosts()
  
      const index = blogPosts.findIndex(blogPost => blogPost.id === blogPostId)
  
      if (index !== -1) {
        const oldBlogPost = blogPosts[index]
  
        const updatedBlogPost= { ...oldBlogPost, ...req.body, updatedAt: new Date() }
  
        blogPosts[index] = updatedBlogPost
  
        writeBlogPosts(blogPosts)
  
        res.send(updatedBlogPost)
      } else {
        next(createHttpError(404, `BlogPost with id ${blogPostId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })


  //**************** DELETE (single blog post) --> DELETE http://localhost:3001/blogPosts/:blogPostId ***********
  //   blogPostsRouter.delete("/:blogPostId", (request, response) => {

  //   // 1. Read the file --> obtaining an array of blogPostss
  //   const blogPostsArray = JSON.parse(fs.readFileSync(blogPostsJSONPath))
  
  //   // 2. Filter out the specified blogPosts from the array, obtaining an array of just the remaining blogPosts
  //   const remainingBlogPosts = blogPostsArray.filter(blogPost => blogPost.id !== request.params.blogPostId) // ! = =
  
  //   // 3. Save the remaining blogPosts back to blogPosts.json file
  //   fs.writeFileSync(blogPostsJSONPath, JSON.stringify(remainingBlogPosts))
  
  //   // 4. Send a proper response
  //   response.status(204).send()
  // }) 

  blogPostsRouter.delete("/:blogPostId", (req, res, next) => {
    try {
      const blogPostId = req.params.blogPostId
  
      const blogPosts = getBlogPosts()
  
      const remainingBlogPosts = blogPosts.filter(blogPost => blogPost.id !== blogPostId)
  
      writeBlogPosts(remainingBlogPosts)
  
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  })

  export default blogPostsRouter;