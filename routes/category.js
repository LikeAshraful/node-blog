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

router.get('/edit/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    if(!category) {
       req.flash('error_msg', 'Category not found');
       req.redirect('/categories') 
    }

    res.render('categories/edit', {category})
});

router.post('/update/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if(!category){
        req.flash('error_msg', 'Category not found');
        req.redirect('/categories');
    }

    category.title = req.body.title;
    category.description = req.body.description;

    await category.save();
    req.flash('success_msg', 'Successfully category updated');
    res.redirect('/categories');
});


router.post('/delete/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            req.flash('error_msg', 'Category not found');
            return res.redirect('/categories');
        } 
        await category.deleteOne({ _id: req.params.id });

        req.flash('success_msg', 'Category deleted successfully');
        res.redirect('/categories');
    } catch (err) {
        console.error(err); 
        req.flash('error_msg', 'Failed to delete category');
        res.status(500).send('Server Error');
    }
});

module.exports = router;
