const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('dashboard', {title : 'Dashboard'});
});

router.get('/posts', async (req, res) => {
    const posts = await Post.find().populate('category').exec();
    res.render('posts/index', { posts: posts });
});

router.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', { post: post });
});

router.get('/post/create', async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('posts/create', {categories});
    } catch (error) {
        console.log(error);
    }
});

router.post('/post/store', async (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
        category: req.body.postCategory,
        tags: req.body.postTags.split(',').map(item => item.trim())
    });
    await post.save();
    res.redirect('/posts');
});


router.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users/index', { users: users });
});

module.exports = router;

    