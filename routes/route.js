const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const paginate = require('../helpers/paginate');
const router = express.Router();


router.get('/', async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const latestPosts  = await paginate(Post, page, 10, 'category');

    res.render('frontend/home', {latestPosts: latestPosts, title : 'home', layout : 'frontend/layouts/main'});

});


router.get('/dashboard', (req, res) => {
    res.render('dashboard', {title : 'Dashboard'});
});


router.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users/index', { users: users });
});

module.exports = router;

    