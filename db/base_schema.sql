BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS user (
  user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  api_key TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS line_item (
  line_item_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date_created INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  date_modified INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  is_income INTEGER NOT NULL CHECK(is_income = 0 OR is_income = 1) DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES user(user_id),
  FOREIGN KEY(category_id) REFERENCES category(category_id)
);

DROP TABLE IF EXISTS category;
CREATE TABLE IF NOT EXISTS category (
  category_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

INSERT INTO category (name) VALUES ("groceries");
INSERT INTO category (name) VALUES ("work expenses");
INSERT INTO category (name) VALUES ("entertainment");
INSERT INTO category (name) VALUES ("paychecks");
INSERT INTO category (name) VALUES ("rent");
INSERT INTO category (name) VALUES ("utilities");
INSERT INTO category (name) VALUES ("restaurants");

END TRANSACTION;
