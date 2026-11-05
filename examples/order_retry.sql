-- The D1 lab shows the blocks above TEACHING-END and src/lessons/orderRetrySql.test.ts runs them with
-- node:sqlite. A block starting with `-- version:` is one way the server handles POST /orders; its
-- `-- POST` line is the request the browser sends. Other comments are not shown.

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  amount INTEGER NOT NULL
);
CREATE TABLE requests (
  request_id TEXT NOT NULL UNIQUE,
  order_id INTEGER NOT NULL REFERENCES orders (order_id)
);

-- version: none
-- POST /orders {"amount": 1280}
INSERT INTO orders (amount) VALUES (:amount);

-- version: server
-- POST /orders {"amount": 1280}
-- The server makes :server_request_id when the request arrives.
BEGIN;
INSERT INTO orders (amount) VALUES (:amount);
INSERT INTO requests (request_id, order_id)
  VALUES (:server_request_id, last_insert_rowid());
COMMIT;

-- version: client
-- POST /orders {"request_id": "r-7f3a", "amount": 1280}
-- The browser made :request_id before the first send; a resend reuses it.
BEGIN;
INSERT INTO orders (amount) VALUES (:amount);
INSERT INTO requests (request_id, order_id)
  VALUES (:request_id, last_insert_rowid());
COMMIT;
-- When the request ID is already recorded, the second INSERT breaks the uniqueness constraint:
-- the server rolls back the whole transaction, so the new order is not kept either, and returns
-- the order recorded the first time.
SELECT order_id FROM requests WHERE request_id = :request_id;

-- TEACHING-END
