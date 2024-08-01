const express = require('express');
const User = require('../models/User');
const router = express.Router();


router.get('/dashboard', (req, res) => {
    res.render('dashboard', {title : 'Dashboard'});
});


router.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users/index', { users: users });
});

module.exports = router;

    