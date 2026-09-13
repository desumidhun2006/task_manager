exports.up = function(knex) {
  return knex.schema.raw(`
    DO $$ BEGIN
      ALTER TABLE tasks 
        ALTER COLUMN reminder DROP DEFAULT,
        ALTER COLUMN reminder TYPE TEXT USING reminder::text,
        ALTER COLUMN reminder SET DEFAULT 'none';
    EXCEPTION WHEN others THEN null;
    END $$;
  `)
}

exports.down = function(knex) {
  return Promise.resolve()
}
