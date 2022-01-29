const { render } = require('ejs');
const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
//const Task = require('../model/task');

// creating blog Schema
const PostSchema = new mongoose.Schema({
  title: String,
  author: String,
  post_date: {type: Date, default: Date.now},
  post_data: String
});
const Post = mongoose.model("Post", PostSchema);

router.use(express.urlencoded({extended: true}));

router.get('/', async function(req,res){
  res.render('index');
});


router.get('/newPost', async (req,res) =>{
  const postData = req.body;
  res.render('newPost');
  //res.send("Success");
});

router.post('/newPost', async (req,res) =>{
  const title = req.body.title.trim() || "";
  const author = req.body.author.trim() || "";
  const post_data = req.body.post_data.trim() || "";

  if (title === "" || author === "" || post_data === "") {
    return res.sendStatus(400);
  }

  const newPost = new Post({title, author, post_data});
  
  newPost.save();

  return res.redirect("/");
});



module.exports = router;