-- 1. Which products are in stock?
SELECT id, title FROM products WHERE stock > 0 ORDER BY id;
-- 2. Read JSONB as text.
SELECT title, metadata->>'color' AS color FROM products;
-- 3. A window function, with a deliberate integer result type.
SELECT title, row_number() OVER (ORDER BY price DESC)::int AS price_rank FROM products ORDER BY price DESC;
