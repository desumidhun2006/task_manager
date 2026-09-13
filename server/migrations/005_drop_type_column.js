exports.up = function(knex) {
  return knex.schema.alterTable('tasks', table => {
    table.dropColumn('type')
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('tasks', table => {
    table.enum('type', ['task', 'event', 'reminder']).defaultTo('task')
  })
}
