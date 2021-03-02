const AppError = require("../utils/appError");
const Post = require('../model/postModel');
const catchAsync = require('../utils/catchAsync');


// Get all the posts
exports.getPosts = catchAsync(async (req, res, next) => {
    try {
        const posts = await Post.find().populate(
            'author', 'name email -_id').select('-_id -__v -id');   

        res.status(200).json({
            status: 'success',
            posts
        });

    } catch(err) {
        return next(new AppError('Something went wrong!!', 401));
    }
});


// Get post using post address (slug)
exports.getPost = catchAsync(async (req, res, next) => {
    try {
        const postId = req.params.post;

        const post = await Post.findOne({ slug: postId }).populate(
            'author', 'name email -_id').select('-_id -__v -id');
    
        if (!post) {
            return next(new AppError("No post exists", 404));
        }
    
        res.status(200).json({
            status: 'success',
            post
        });
    } catch(err) {
        return next(new AppError('Something went wrong!', 401));
    }
});


// Create a new post
exports.createPost = catchAsync(async (req, res, next) => {
    try {
        const { title, content } = req.body;

        if (title == undefined || content == undefined){
            return next(new AppError("Title and conetent are required!", 400));
        }

        // data that will be returned to the clinet
        let data;

        const doc = await Post.create({
            author: req.user.id,
            title,
            content
            // Get newly created post
        }).then(async (post) => {
            data = await Post.findOne(post._id).populate(
                'author', 'name email -_id').select('-_id -__v -id');
        });

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err){
        return next(new AppError(err, 401));
    }

});


// Delete an existing post
exports.deletePost = catchAsync(async (req, res, next) => {
    try {
        const postId = req.params.post;
        const doc = await Post.findOneAndDelete({ slug: postId });
        
        if (!doc) {
            return next(new AppError('No document found', 404));
        }
    
        res.status(204).json({
            stats: 'success',
            message: "The post is successfully deleted"
        });
    } catch (err){
        return next(new AppError('Something went wrong!', 401));
    }

});


// Update an exsiting post
exports.updatePost = catchAsync(async (req, res, next) => {
    try {
        const {title, content } = req.body;
        const postId = req.params.post;
    
        // console.log(`id:${id}, title:${title}, content:${content}`);
        if (title == undefined || content == undefined){
            return next(new AppError("Post ID, Title and conetent are required!", 400));
        }
    
        const doc = await Post.findOneAndUpdate({ slug: postId }, 
            { title, content }, { new: true, runValidators: true}).populate(
                'author', 'name email -_id').select('-_id -__v -id');
    
        if (!doc) {
            return next(new AppError('No document found', 404));
        }
    
        res.status(201).json({
            stats: 'success',
            data: {
                data: doc
            }
        });
    } catch (err){
        return next(new AppError('Something went wrong!', 401));
    }
});


exports.reactPost = catchAsync(async (req, res, next) => {
    try {
        const postId = req.params.post;
        const userReact = req.query.react;
        let doc;

        // Increment like and dislike count
        if (userReact === 'like') {
            doc = await Post.findOneAndUpdate({ slug: postId }, 
                {$inc: {like: 1}}, { new: true, runValidators: true})
                .populate('author', 'name email -_id').select('-_id -__v -id');

        } else if (userReact === 'unlike') {
            doc = await Post.findOneAndUpdate({ slug: postId }, 
                {$inc: {unlike: 1}}, { new: true, runValidators: true})
                .populate('author', 'name email -_id').select('-_id -__v -id');

        } else {
            return next(new AppError('Invalid request. It must be lie or dislike', 400))
        }

        res.status(201).json({
            stats: 'success',
            data: doc
        });

    } catch (err){
        // return next(new AppError('Something went wrong!', 401));
        return next(new AppError(err, 401));
    }
});