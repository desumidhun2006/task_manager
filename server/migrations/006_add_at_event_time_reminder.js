exports.up = function(knex) {
  return knex.schema.raw(`
    DO $$ BEGIN
      ALTER TABLE tasks ALTER COLUMN reminder TYPE TEXT;
    EXCEPTION WHEN others THEN null;
    END $$;
  `).then(() => {
    return knex.schema.raw(`
      DO $$ BEGIN
        ALTER TABLE tasks ALTER COLUMN reminder SET DEFAULT 'none';
      EXCEPTION WHEN others THEN null;
      END $$;
    `)
  })
}

exports.down = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE tasks ALTER COLUMN reminder TYPE VARCHAR(255)
  `)
}
