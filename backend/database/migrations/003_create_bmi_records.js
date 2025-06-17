// Example migration. Add the '.js' extension to activate it
// Our 0.0.3 version includes the table 'bmi_record'

exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS bmi_record (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      height DECIMAL(5,2) NOT NULL,
      weight DECIMAL(5,2) NOT NULL,
      bmi DECIMAL(4,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (id)
    );
  `)
}

exports.down = async function (knex) {
  await knex.raw(`
    DROP TABLE bmi_record;
  `)
}

exports.config = { transaction: true }