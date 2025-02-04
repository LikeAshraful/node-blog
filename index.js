const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const dayjs = require('dayjs');
require('dotenv').config();
require('./config/passport'); // Passport configuration

const menus = require('./middlewares/menu');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.set('layout', 'layouts/main');
app.use(menus);


// Session and Passport middleware
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.dayjs = dayjs;
    next();
});

// Define public routes
const publicRoutes = ['/', /^\/detail\/.*/, '/login', '/register'];

// Ensure Authentication middleware
const { ensureAuthenticated } = require('./middlewares/auth');
app.use((req, res, next) => {
    if (publicRoutes.some(route => typeof route === 'string' ? req.path === route : route.test(req.path))) {
        return next();
    }
    ensureAuthenticated(req, res, next);
});

// Routes
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/route');
const categoryRoutes = require('./routes/category');
const postRoutes = require('./routes/post');

// Use routes
app.use('/', authRoutes);
app.use('/', appRoutes);
app.use('/categories', categoryRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
