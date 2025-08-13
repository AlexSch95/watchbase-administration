USE watchbase;

-- 1. Genres einfügen
INSERT INTO genres (genre_id, genre_name) VALUES
(1, 'Action'),
(2, 'Drama'),
(3, 'Comedy'),
(4, 'Science Fiction'),
(5, 'Fantasy'),
(6, 'Thriller'),
(7, 'Romance'),
(8, 'Horror');

-- 2. Schauspieler einfügen
INSERT INTO actors (actor_id, actor_name) VALUES
(1, 'Robert Downey Jr.'),
(2, 'Chris Evans'),
(3, 'Scarlett Johansson'),
(4, 'Tom Holland'),
(5, 'Leonardo DiCaprio'),
(6, 'Kate Winslet'),
(7, 'Keanu Reeves'),
(8, 'Carrie-Anne Moss'),
(9, 'Harrison Ford'),
(10, 'Mark Hamill'),
(11, 'Emma Stone'),
(12, 'Ryan Gosling');

-- 3. Filme einfügen
INSERT INTO movies (movie_id, title, release_year, director, short_description, trailer_url, poster, rating) VALUES
(1, 'Avengers: Endgame', 2019, 'Anthony Russo, Joe Russo', 'Superhelden vereinen sich gegen Thanos.', 'https://youtu.be/TcMBFSGVi1c', 'endgame.jpg', 8.4),
(2, 'Titanic', 1997, 'James Cameron', 'Eine tragische Liebesgeschichte auf der Titanic.', 'https://youtu.be/kVrqfYjkTdQ', 'titanic.jpg', 7.9),
(3, 'The Matrix', 1999, 'Lana Wachowski, Lilly Wachowski', 'Ein Hacker entdeckt die Wahrheit über seine Welt.', 'https://youtu.be/vKQi3bBA1y8', 'matrix.jpg', 8.7),
(4, 'Inception', 2010, 'Christopher Nolan', 'Ein Dieb dringt in die Träume anderer ein.', 'https://youtu.be/YoHD9XEInc0', 'inception.jpg', 8.8),
(5, 'Star Wars: A New Hope', 1977, 'George Lucas', 'Ein junger Farmer wird zum Jedi.', 'https://youtu.be/vZ734NWnAHA', 'starwars4.jpg', 8.6),
(6, 'La La Land', 2016, 'Damien Chazelle', 'Musikalische Liebesgeschichte in Los Angeles.', 'https://youtu.be/0pdqf4P9MB8', 'lalaland.jpg', 8.0),
(7, 'Iron Man', 2008, 'Jon Favreau', 'Ein Milliardär wird zum Superhelden.', 'https://youtu.be/8hYlB38asDY', 'ironman.jpg', 7.9),
(8, 'Guardians of the Galaxy', 2014, 'James Gunn', 'Eine Gruppe Außenseiter rettet die Galaxie.', 'https://youtu.be/d96cjJhvlMA', 'guardians.jpg', 8.0),
(9, 'The Godfather', 1972, 'Francis Ford Coppola', 'Die Geschichte der Corleone-Familie.', 'https://youtu.be/sY1S34973zA', 'godfather.jpg', 9.2),
(10, 'Interstellar', 2014, 'Christopher Nolan', 'Eine Reise durch Raum und Zeit zur Rettung der Menschheit.', 'https://youtu.be/zSWdZVtXT7E', 'interstellar.jpg', 8.6);

-- 4. Kreuztabelle Filme - Genres
INSERT INTO movies_with_genres (relation_id, genre_id, movie_id) VALUES
(1, 1, 1), -- Avengers: Endgame - Action
(2, 4, 1), -- Avengers: Endgame - Sci-Fi
(3, 7, 2), -- Titanic - Romance
(4, 2, 2), -- Titanic - Drama
(5, 4, 3), -- Matrix - Sci-Fi
(6, 6, 3), -- Matrix - Thriller
(7, 6, 4), -- Inception - Thriller
(8, 4, 4), -- Inception - Sci-Fi
(9, 5, 5), -- Star Wars - Fantasy
(10, 4, 5), -- Star Wars - Sci-Fi
(11, 7, 6), -- La La Land - Romance
(12, 3, 6), -- La La Land - Comedy
(13, 1, 7), -- Iron Man - Action
(14, 4, 7), -- Iron Man - Sci-Fi
(15, 1, 8), -- Guardians - Action
(16, 4, 8), -- Guardians - Sci-Fi
(17, 2, 9), -- Godfather - Drama
(18, 6, 9), -- Godfather - Thriller
(19, 4, 10), -- Interstellar - Sci-Fi
(20, 2, 10); -- Interstellar - Drama

-- 5. Kreuztabelle Filme - Schauspieler
INSERT INTO movies_with_actors (relation_id, movie_id, actor_id) VALUES
(1, 1, 1), -- RDJ in Avengers
(2, 1, 2), -- Evans in Avengers
(3, 1, 3), -- Johansson in Avengers
(4, 1, 4), -- Holland in Avengers
(5, 2, 5), -- DiCaprio in Titanic
(6, 2, 6), -- Winslet in Titanic
(7, 3, 7), -- Reeves in Matrix
(8, 3, 8), -- Moss in Matrix
(9, 4, 5), -- DiCaprio in Inception
(10, 4, 11), -- Stone in Inception (fiktiv)
(11, 5, 9), -- Ford in Star Wars
(12, 5, 10), -- Hamill in Star Wars
(13, 6, 11), -- Stone in La La Land
(14, 6, 12), -- Gosling in La La Land
(15, 7, 1), -- RDJ in Iron Man
(16, 8, 3), -- Johansson in Guardians
(17, 8, 4), -- Holland in Guardians
(18, 9, 5), -- DiCaprio (fiktiv in Godfather)
(19, 10, 5), -- DiCaprio in Interstellar (fiktiv)
(20, 10, 12); -- Gosling in Interstellar (fiktiv)

-- 7. User Watchlists
INSERT INTO user_movies (watchlist_id, user_id, movie_id, watched_status) VALUES
(1, 2, 1, TRUE),
(2, 2, 2, TRUE),
(3, 2, 4, FALSE);
