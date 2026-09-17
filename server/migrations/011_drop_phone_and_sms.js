exports.up = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('phone')
  }).then(() => {
    return knex.schema.alterTable('settings', table => {
      table.dropColumn('reminder_sms')
    })
  })
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.string('phone').notNullable().defaultTo('')
  }).then(() => {
    return knex.schema.alterTable('settings', table => {
      table.boolean('reminder_sms').defaultTo(true)
    })
  })
}
