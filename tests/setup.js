const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    await mongoose.disconnect();
    
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Simple connection without the metadata bypasses
    await mongoose.connect(uri);
}, 120000); 

afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany();
        }
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
});