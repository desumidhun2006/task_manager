exports.up = function(knex) {
  return knex.schema.raw(`
    DO $$ BEGIN
      ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
    EXCEPTION WHEN duplicate_column THEN null;
    END $$;
  `)
}

exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('email_verified')
  })
}
