CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author varchar(255),
    url varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    likes int  DEFAULT 0
);

insert into blogs (author, url, title) values ('Greg Bear', 'www.gregbear.com', 'Blood Music');
insert into blogs (author, url, title) values ('Peter Hamilton', 'www.phamilton.com', 'Naked God');

SELECT * from blogs;