const redis = require('redis');
const mongoose = require('mongoose');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
const { promisify } = require('util');
client.hget = promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

const cache = mongoose.Query.prototype.cache;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    };

    const key = JSON.stringify(Object.assign({}, this.getQuery, {
        collection: this.mongooseCollection.name
    }));

    const cacheValue = await client.hget(this.hashKey, key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        console.log(cacheValue);

        return Array.isArray(doc) 
            ? doc.map((d) => new this.model(d))
            : new this.model(doc)
    };

    const result = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 60 * 60 * 24);

    return result;
};

function clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
};

module.exports = { cache, exec, clearHash };