exports.up = function(knex) {
  return knex.schema.alterTable('tasks', table => {
    table.timestamp('end_time').nullable().alter()
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('tasks', table => {
    table.timestamp('end_time').notNullable().alter()
  })
}
