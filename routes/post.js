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
    req.flash('success_msg', 'Post Created successfully');
    res.redirect('/posts');
});


router.get('/edit/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('category');
        if (!post) {
            req.flash('error_msg', 'Post not found');
            return res.redirect('/posts');
        }
        const categories = await Category.find();
        res.render('posts/edit', { post, categories });
    } catch (error) {
        res.status(500).send('Internal Server Error');        
    }
});

// Route to handle post update
router.post('/update/:id', upload.single('featuredImage'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found');
            return res.redirect('/posts');
        }

        post.title = req.body.postTitle;
        post.content = req.body.postContent;
        post.category = req.body.postCategory;
        post.tags = req.body.postTags.split(',').map(item => item.trim());
        
        if (req.file) {
            post.featuredImage = `/uploads/${req.file.filename}`;
        }

        await post.save();
        req.flash('success_msg', 'Post updated successfully');
        res.redirect('/posts');
    } catch (err) {
        console.error(err); // Debug: Log any errors that occur
        req.flash('error_msg', 'Failed to update post');
        res.status(500).send('Server Error');
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found');
            return res.redirect('/posts');
        }

        if (post.featuredImage) {
            fs.unlink(uploadDir + post.featuredImage, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        }

        await Post.deleteOne({ _id: req.params.id });

        req.flash('success_msg', 'Post deleted successfully');
        res.redirect('/posts');
    } catch (err) {
        console.error(err); 
        req.flash('error_msg', 'Failed to delete post');
        res.status(500).send('Server Error');
    }
});


module.exports = router;