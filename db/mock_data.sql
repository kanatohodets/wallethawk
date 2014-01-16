
INSERT INTO user (email) VALUES ('benjamin.tyler+test1@gmail.com');
INSERT INTO user (email) VALUES ('benjamin.tyler+test2@gmail.com');

INSERT INTO line_item (
  user_id,
  description,
  amount,
  category_id,
  is_income)
VALUES (1, "dinner for two at a fancy place", "250000", 7, 0);

INSERT INTO line_item (
  user_id,
  description,
  amount,
  category_id,
  is_income)
VALUES (1, "payday!", "2650000", 4, 1);

INSERT INTO line_item (
  user_id,
  description,
  amount,
  category_id,
  is_income)
VALUES (1, "weekly groceries", "65000", 1, 0);



