const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;