const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.render('categories/index', { categories: categories });
});

router.get('/create', (req, res) => {
    res.render('categories/create');
});

router.post('/store', async (req, res) => {
    const category = new Category({
        title: req.body.title,
        description: req.body.description
    });
    await category.save();
    req.flash('success_msg', 'Category created successfully');
    res.redirect('/categories');
});

module.exports = router;
