create TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(15),
    email VARCHAR(40),
    password VARCHAR(100)
);
create TABLE post(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    content VARCHAR,
    create_date DATE,
    update_date DATE,
    img VARCHAR, (пока что с одний картинкой)
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES users (id)
);
-- create TABLE img(
--     id SERIAL PRIMARY KEY,
--     postID INTEGER,
--     img VARCHAR,
--     FOREIGN KEY (postID) REFERENCES post (id)
-- );
create TABLE comments(
    id SERIAL PRIMARY KEY,
    userID INTEGER,
    content VARCHAR(255),
    postID INTEGER,
    FOREIGN KEY (postID) REFERENCES post (id),
    FOREIGN KEY (userID) REFERENCES users (id) 
);
create TABLE likes(
    id SERIAL PRIMARY KEY,
    userID INTEGER,
    postID INTEGER,
    FOREIGN KEY (postID) REFERENCES post (id),
    FOREIGN KEY (userID) REFERENCES users (id) 
);