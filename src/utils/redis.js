const redis = require('redis');
const mongoose = require('mongoose');
const redisUrl = process.env.REDIS_URL;
const client = redis.createClient(redisUrl);
const { promisify } = require('util');
client.hget = promisify(client.hget);

/** Mongoose Queries for MongoDB 
 * exec references the built-in prototype constructor
 * function
 * cache is the cache
*/
const exec = mongoose.Query.prototype.exec;
// const cache = mongoose.Query.prototype.cache;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
};

/** Query on exexute mongoose query */
mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    };

    /** Assign a key and turn it to a string value */
    const key = JSON.stringify(Object.assign({}, this.getQuery, {
        collection: this.mongooseCollection.name
    }));

    const cacheValue = await client.hget(this.hashKey, key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        // console.log(cacheValue);

        return Array.isArray(doc) 
            ? doc.map((d) => new this.model(d))
            : new this.model(doc)
    };

    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result));

    return result;
};

/** Function to clear cached Items */
function clearHash(hashKey) {
    client.hdel(JSON.stringify(hashKey));
};

module.exports = { exec, clearHash };