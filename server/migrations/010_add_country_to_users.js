exports.up = function(knex) {
  return knex.schema.raw(`
    DO $$ BEGIN
      ALTER TABLE users ADD COLUMN country VARCHAR(2) DEFAULT 'IN';
    EXCEPTION WHEN duplicate_column THEN null;
    END $$;
  `)
}

exports.down = function(knex) {
  return knex.schema.raw('ALTER TABLE users DROP COLUMN IF EXISTS country')
}
