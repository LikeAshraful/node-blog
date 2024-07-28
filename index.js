const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // Passport configuration

const app = express();

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.set('layout', 'layouts/main');

// Session and Passport middleware
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

const { ensureAuthenticated } = require('./middlewares/auth');
app.use((req, res, next) => {
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }
    ensureAuthenticated(req, res, next);
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);


app.get('/', (req, res) => {
    res.render('dashboard', {title : 'Dashboard'});
});

app.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.render('posts/index', { posts: posts });
});

app.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', { post: post });
});

app.get('/post/create', ensureAuthenticated, (req, res) => {
    res.render('posts/create');
});

app.post('/post/store', ensureAuthenticated, async (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
        categories: req.body.postCategories.split(',').map(item => item.trim()),
        tags: req.body.postTags.split(',').map(item => item.trim())
    });
    await post.save();
    res.redirect('/posts');
});

app.get('/categories/:category', async (req, res) => {
    const posts = await Post.find({ categories: req.params.category });
    res.render('home', { posts: posts });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
