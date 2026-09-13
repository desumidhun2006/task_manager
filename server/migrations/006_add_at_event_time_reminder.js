exports.up = function(knex) {
  return knex.raw(`
    ALTER TABLE tasks 
    ALTER COLUMN reminder TYPE TEXT
  `).then(() => {
    return knex.raw(`
      ALTER TABLE tasks 
      ALTER COLUMN reminder SET DEFAULT 'none'
    `)
  })
}

exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE tasks 
    ALTER COLUMN reminder TYPE VARCHAR(255)
  `)
}
