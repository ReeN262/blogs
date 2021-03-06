create TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(15),
    email VARCHAR(40),
    password VARCHAR(100)
);
create TABLE post(
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    content VARCHAR,
    create_date timestamp,
    update_date timestamp,
    img VARCHAR, 
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES users (id)
);

create TABLE comments(
    id SERIAL PRIMARY KEY,
    userID INTEGER,
    create_date timestamp
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
create TABLE answer(
    id SERIAL PRIMARY KEY,
    userID INTEGER,
    content VARCHAR(255),
    commentID INTEGER,
    create_date timestamp
    FOREIGN KEY (commentID) REFERENCES comments (id),
    FOREIGN KEY (userID) REFERENCES users (id) 
)
create TABLE comments_likes(
    id SERIAL PRIMARY KEY,
    userID INTEGER,
    commentsID INTEGER,
    FOREIGN KEY (commentsID) REFERENCES comments (id),
    FOREIGN KEY (userID) REFERENCES users (id) 
);