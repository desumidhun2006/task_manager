exports.up = function(knex) {
  return knex.schema.createTable('settings', table => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').unique()
    table.enum('default_view', ['monthly', 'weekly', 'daily']).defaultTo('monthly')
    table.boolean('reminder_sms').defaultTo(true)
    table.boolean('reminder_email').defaultTo(true)
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('settings')
}
