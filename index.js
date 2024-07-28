const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const app = express();
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB');

// Define a schema and model for blog posts
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    categories: [String],
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);

// Set up body-parser and EJS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use('expressLayouts');
app.set('layout', 'layouts/main');

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('home', { posts: posts });
});

app.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', { post: post });
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', async (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
        categories: req.body.postCategories.split(',').map(item => item.trim()),
        tags: req.body.postTags.split(',').map(item => item.trim())
    });
    await post.save();
    res.redirect('/');
});

app.get('/categories/:category', async (req, res) => {
    const posts = await Post.find({ categories: req.params.category });
    res.render('home', { posts: posts });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
