const { createClient } = require('redis');
const { rateLimit } = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const slowDown = require('express-slow-down');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://redis:6379'
});

redisClient.connect().catch(console.error);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    })
});

const standardLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    })
});

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: 150,
    maxDelayMs: 2000
});

module.exports = { authLimiter, standardLimiter, speedLimiter };