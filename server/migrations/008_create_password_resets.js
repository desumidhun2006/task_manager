exports.up = function(knex) {
  return knex.schema.createTable('password_resets', table => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    table.string('code').notNullable()
    table.timestamp('expires_at').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('password_resets')
}
