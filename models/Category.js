const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    isMenu: {
        type: Boolean,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;