CREATE TABLE IF NOT EXISTS user (
  user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS line_item (
  line_item_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  date_created INTEGER NOT NULL DEFAULT datetime('now', 'unixepoch'),
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  is_income INTEGER NOT NULL CHECK(is_income = 0 OR is_income = 1) DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES user(user_id),
  FOREIGN KEY(category_id) REFERENCES category(category_id)
);

CREATE TABLE IF NOT EXISTS category (
  category_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);


