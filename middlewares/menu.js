const Category = require('../models/Category'); // Adjust the path as needed

module.exports = async (req, res, next) => {
    try {
        const menus = await Category.find({ isMenu: true }).lean();
        res.locals.menus = menus;
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
};
