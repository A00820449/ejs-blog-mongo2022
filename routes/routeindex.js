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
  const posts = await Post.find();
  res.render('index', {posts});
});


router.get('/newPost', async (req,res) =>{
  res.render('newPost');
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

router.get("/edit/:id", async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    res.render("edit", {post});
  }
  catch(e) {
    console.error(e);
    res.sendStatus(400);
  }
});

router.post("/edit/:id", async (req,res)=>{
  try {
    const id = req.params.id || "";

    const author = req.body.author.trim() || "";
    const post_data = req.body.post_data.trim() || "";
    const title = req.body.title.trim() || "";

    if (author === "" || post_data === "" || title === "" || id === "") {
      throw new Error("Empty fields");
    }

    await Post.findByIdAndUpdate(id, {author, post_data, title});

    res.redirect("/");
  }
  catch(e) {
    console.error(e);
    res.sendStatus(400);
  }
});


router.get("/delete/:id", async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    res.render("delete", {post});
  }
  catch(e) {
    console.error(e);
    res.sendStatus(400);
  }
});
router.post("/delete/:id", async (req,res)=>{
  try {
    const id = req.params.id;

    if (!id) {
      throw new Error("No id");
    }

    await Post.findByIdAndDelete(id);

    res.redirect("/");
  }
  catch(e) {
    console.error(e);
    res.sendStatus(400);
  }
});

module.exports = router;