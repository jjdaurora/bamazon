-- some lines of code from mySQL database -- doesn't include all the INSERTS

USE bamazonDB;

CREATE TABLE products(
  item_id INTEGER AUTO_INCREMENT NOT NULL,
  product VARCHAR(45) NOT NULL,
  department_name INTEGER NOT NULL,
  price INTEGER NOT NULL,
  stock_quantity INTEGER NOT NULL,
  PRIMARY KEY (item_id)
);

ALTER TABLE products MODIFY department_name VARCHAR(30);

USE bamazonDB;
INSERT INTO products (product, department_name, price, stock_quantity)
VALUES ("boots", "outdoors", 80, 35), ("chair", "furniture", 200, 10), ("pens", "office", 3, 1000), ("bananas", "grocery", 1, 3000)