const mongoose = require('mongoose');
const Post = require('../../Post');

describe('Post Model Unit Tests', () => {
    it('Should validate the presence of required fields', async () => {
        const post = new Post({});

        let error;
        try {
            await post.validate();
        } catch(err) {
            error = err;
        }
        expect(error.errors.title).toBeDefined();
        expect(error.errors.body).toBeDefined();
        expect(error.errors.author).toBeDefined();
    });

    it('Should allow posts with optional images field', () => {
        const post = new Post({
            title: 'test tiltle',
            body: 'test body',
            author: new mongoose.Types.ObjectId(),
            images: 'http://example.com/image.jpg'
        });
        expect(post.images).toEqual('http://example.com/image.jpg');
    });

    it('Should create a post without images when not provided', () => {
        const post = new Post({
            title: 'test tiltle',
            body: 'test body',
            author: new mongoose.Types.ObjectId(),           
        });
        expect(post.images).toBeUndefined();
    });
});