exports.up = function(knex) {
  return knex.schema.raw('ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_reminder_check')
}

exports.down = function(knex) {
  return knex.schema.raw(
    "ALTER TABLE tasks ADD CONSTRAINT tasks_reminder_check CHECK (reminder IN ('none','0m','15m','30m','1h','1d'))"
  )
}
