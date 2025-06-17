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
      UNIQUE (id)
    );