const db = require('../data/dbConfig');

module.exports = {
    findBy,
    add
}

function findBy(filter) {
    return db('users').where(filter).first();
}

function add(credentials) {
    return db('users').insert(credentials);
}