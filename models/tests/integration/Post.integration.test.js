const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Post = require('../../Post');

describe('Post Model Integration Test', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await Post.deleteMany({});
    });

    it('Should create and save a post successfully', async () => {
        const post = new Post({
            title: 'Integration test post',
            body: 'Integration test body',
            author: new mongoose.Types.ObjectId()
        });

        const savedPost = await post.save();

        expect(post._id).toBeDefined();
        expect(post.title).toEqual(savedPost.title);
        expect(post.body).toEqual(savedPost.body);
        expect(post.author).toEqual(savedPost.author)
    });

    it('Should update a post successfully', async () => {
        let post = new Post({
            title: 'Original title',
            body: 'Original body',
            author: new mongoose.Types.ObjectId()
        });

        await post.save();

        const updatedData = { 
            title: 'Updated title',
            body: 'Updated body'
        };

        const updatedPost = await Post.findByIdAndUpdate(
            post._id, 
            updatedData, 
            { new: true }
        )
        
        expect(updatedPost.title).toEqual(updatedData.title);
        expect(updatedPost.body).toEqual(updatedData.body)
    })

    it('Should delete a post successfully', async () => {
        let post = new Post({
            title: 'Original title',
            body: 'Original body',
            author: new mongoose.Types.ObjectId()
        });
        
        await post.save();

        await Post.findByIdAndDelete(post._id);

        const deletedPost = await Post.findById(post._id);

        expect(deletedPost).toBeNull();
    })
})