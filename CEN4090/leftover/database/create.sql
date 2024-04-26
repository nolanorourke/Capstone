DROP TABLE IF EXISTS Users CASCADE;
CREATE TABLE Users(
    username VARCHAR(255) PRIMARY KEY,
    email_address VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Foods CASCADE;
CREATE TABLE Foods(
    food_name VARCHAR(255) PRIMARY KEY,
    food_type VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Recipes CASCADE;
CREATE TABLE Recipes(
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(255),
    time_added DATE NOT NULL,
    author varchar,
    FOREIGN KEY (author) REFERENCES Users(username)
);

DROP TABLE IF EXISTS Recipe_Foods CASCADE;
CREATE TABLE Recipe_Foods(
    recipe_food_id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
    FOREIGN KEY (food_name) REFERENCES Foods(food_name),
    UNIQUE (recipe_id, food_name) 
);

DROP TABLE IF EXISTS Recipe_Ingredients CASCADE;
CREATE TABLE Recipe_Ingredients(
    recipe_ingredient_id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    ing_name VARCHAR(255) NOT NULL,
    quantity FLOAT NOT NULL,
    measurement VARCHAR(8),
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
    FOREIGN KEY (ing_name) REFERENCES Foods(food_name)
);

DROP TABLE IF EXISTS Steps CASCADE;
CREATE TABLE Steps(
    step_id SERIAL PRIMARY KEY,
    recipe_id SERIAL,
    step_description TEXT NOT NULL,
    step_number INT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id)
);

DROP TABLE IF EXISTS Pantry CASCADE;
CREATE TABLE Pantry(
    pantry_id SERIAL PRIMARY KEY,
    ownername VARCHAR(255) UNIQUE,
    FOREIGN KEY (ownername) REFERENCES Users(username)
);

DROP TABLE IF EXISTS Pantry_Food CASCADE;
CREATE TABLE Pantry_Food (
    pantry_food_id SERIAL PRIMARY KEY,
    pantry_id INTEGER,
    food_name VARCHAR(255),
    FOREIGN KEY (pantry_id) REFERENCES Pantry(pantry_id),
    FOREIGN KEY (food_name) REFERENCES Foods(food_name),
    UNIQUE (pantry_id, food_name) -- Ensures combination of pantry_id and food_name is unique
);

DROP TABLE IF EXISTS Pantry_Ingredients CASCADE;
CREATE TABLE Pantry_Ingredients(
    pantry_ingredient_id SERIAL PRIMARY KEY,
    pantry_food_id INTEGER,
    quantity FLOAT NOT NULL,
    measurement VARCHAR(8),
    FOREIGN KEY (pantry_food_id) REFERENCES Pantry_Food(pantry_food_id)
);

DROP TABLE IF EXISTS Reports CASCADE;
CREATE TABLE Reports(
    report_id SERIAL PRIMARY KEY,
    recipe_title VARCHAR(255),
    reporter VARCHAR(255),
    title VARCHAR(50),
    report TEXT NOT NULL,
    FOREIGN KEY (reporter) REFERENCES Users(username)
);