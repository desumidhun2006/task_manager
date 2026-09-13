exports.up = function(knex) {
  return knex.schema.createTable('tasks', table => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    table.string('title').notNullable()
    table.text('description')
    table.timestamp('start_time').notNullable()
    table.timestamp('end_time').notNullable()
    table.enum('type', ['task', 'event', 'reminder']).defaultTo('task')
    table.enum('reminder', ['none', '15m', '30m', '1h', '1d']).defaultTo('none')
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tasks')
}
