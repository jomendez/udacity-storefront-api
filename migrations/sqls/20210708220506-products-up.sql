CREATE TABLE products (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL, 
    "price" NUMERIC(17,2)  NOT NULL, /* Limit price to 15 digits before decimal, and two after. */
    "category" VARCHAR
);