exports.up = function(knex) {
  return knex('password_resets').del()
    .then(() => knex('settings').del())
    .then(() => knex('tasks').del())
    .then(() => knex('users').del())
}

exports.down = function() {
  return Promise.resolve()
}
