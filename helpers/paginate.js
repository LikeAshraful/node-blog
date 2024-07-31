const paginate = async (model, page, limit = 10, populate = '') => {
    const skip = (page - 1) * limit;
    
    const totalDocuments = await model.countDocuments();
    const documents = await model.find()
        .populate(populate)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(totalDocuments / limit);

    return {
        documents,
        totalDocuments,
        currentPage: page,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1
    };
};

module.exports = paginate;
