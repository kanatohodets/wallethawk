
INSERT INTO user (email, api_key) VALUES ('benjamin.tyler+test1@gmail.com', '8167a95d-746f-4533-9e8d-1749f341dda1');
INSERT INTO user (email, api_key) VALUES ('benjamin.tyler+test2@gmail.com', '3184ed20-f3d2-4112-9f59-095c6ad0df6d');

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



