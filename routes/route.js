const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('dashboard', {title : 'Dashboard'});
});

router.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.render('posts/index', { posts: posts });
});

router.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', { post: post });
});

router.get('/post/create', (req, res) => {
    res.render('posts/create');
});

router.post('/post/store', async (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
        categories: req.body.postCategories.split(',').map(item => item.trim()),
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

    