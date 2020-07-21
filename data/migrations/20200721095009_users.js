
exports.up = function(knex) {
    return knex.schema.createTable('users', users => {
        users.increments('id');
        users.text('username', 128).unique().notNullable();
        users.text('password', 128).notNullable();
    })
};

exports.down = function(knex) { 
    return knex.schema.dropTableIfExist('users');
};
