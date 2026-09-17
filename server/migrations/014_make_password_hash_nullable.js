exports.up = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.string('password_hash').nullable().alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.string('password_hash').notNullable().alter()
  })
}
