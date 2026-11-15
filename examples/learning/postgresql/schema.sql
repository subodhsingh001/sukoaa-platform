CREATE TABLE products (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title text NOT NULL, price integer NOT NULL CHECK (price > 0), stock integer NOT NULL CHECK (stock >= 0), metadata jsonb NOT NULL DEFAULT '{}'::jsonb);
INSERT INTO products (title, price, stock, metadata) VALUES ('Notebook',12,5,'{"color":"green"}'),('Lamp',35,2,'{"color":"white"}'),('Bag',24,0,'{"color":"blue"}');
