const express = require('express');
const Post = require('../models/Post');
const Category = require('../models/Category');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');



const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });




router.get('/', async (req, res) => {
    const posts = await Post.find().populate('category').exec();
    res.render('posts/index', { posts: posts });
});

router.get('/create',  async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('posts/create', {categories});
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', { post: post });
});

router.post('/store', upload.single('featuredImage'), async (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
        category: req.body.postCategory,
        tags: req.body.postTags.split(',').map(item => item.trim()),
        featuredImage: req.file ? `/uploads/${req.file.filename}` : null
    });
    await post.save();
    res.redirect('/posts');
});

module.exports = router;