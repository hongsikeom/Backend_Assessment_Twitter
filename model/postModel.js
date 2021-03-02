const mongoose = require('mongoose');
const slugify = require('slugify');


// Post model schema
const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Post must belong to a user']
        },
        title: {
            type: String,
            require: true
        },
        content: {
            type: String,
            require: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        like: {
            type: Number,
            default: 0
        },
        unlike: {
            type: Number,
            default: 0
        },
        slug: {
            type: String,
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


// Set the twit address based on the current time when the post is created
postSchema.pre('save', function (next) {
    this.slug = slugify(`${Date.now()}`, { lower: true });
    next();
});


// Twits will be sorted by the time when the posts are created
postSchema.pre(/^find/, function (next) {
    this.sort({ createdAt: -1 });
    next();
});

// Set the update date when user update the content
postSchema.pre('findOneAndUpdate', function(){
    if (this.like <= 0 || this.unlike <= 0) {
        next();
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;