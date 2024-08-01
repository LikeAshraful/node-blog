const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();


// Register route
router.get('/register', (req, res) => {
    res.render('register', { layout: 'layouts/auth' });
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, email, phone } = req.body;
        const user = new User({ username, password, email, phone });
        await user.save();

        req.login(user, err => {
            if (err) return next(err);
            return res.redirect('/dashboard');
        });
        // res.redirect('/login');


    } catch (err) {
        res.status(500).send('Error registering new user');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login', { layout: 'layouts/auth' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

// Logout route
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/login');
    });
});

module.exports = router;
