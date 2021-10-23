const NodeCache= require('node-cache');

const cache = new NodeCache({ stdTTL: 60 * 60 * 1, checkperiod: 60 * 60 * 24 * 1 });

exports.get = (key) => {
    return cache.get(key);
}
exports.set = (key, value) => {
    return cache.set(key, value);
}
exports.has = (key) => {
    return cache.has(key);
}
exports.del =(key) => {
    return cache.del(key);
}
exports.flush = () => {
    return cache.flushAll();
}
exports.getStats = () => {
    return cache.getStats();
}
exports.getKeys = () => {
    return cache.keys();
}

