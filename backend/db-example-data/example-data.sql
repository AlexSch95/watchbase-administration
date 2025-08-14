-- Genres einfügen
INSERT INTO genres (genre_name) VALUES 
('Action'), ('Adventure'), ('Sci-Fi'), ('Drama'), ('Crime'), 
('Thriller'), ('Fantasy'), ('Comedy'), ('Horror'), ('Animation'), 
('Romance'), ('Mystery'), ('Biography'), ('History'), ('War');

-- Schauspieler einfügen
INSERT INTO actors (actor_name) VALUES
('Tom Hanks'), ('Leonardo DiCaprio'), ('Christian Bale'), ('Heath Ledger'), ('Robert Downey Jr.'),
('Scarlett Johansson'), ('Morgan Freeman'), ('Brad Pitt'), ('Edward Norton'), ('Keanu Reeves'),
('Hugh Jackman'), ('Joaquin Phoenix'), ('Matt Damon'), ('Al Pacino'), ('Meryl Streep'),
('Anne Hathaway'), ('Emma Watson'), ('Daniel Radcliffe'), ('Rupert Grint'), ('Gary Oldman');

-- Filme einfügen
INSERT INTO movies (title, release_year, director, short_description, trailer_url, poster, rating) VALUES
('The Dark Knight', 2008, 'Christopher Nolan', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg', 9.0),
('Inception', 2010, 'Christopher Nolan', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg', 8.8),
('The Shawshank Redemption', 1994, 'Frank Darabont', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'https://www.youtube.com/watch?v=6hB3S9bIaco', 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg', 9.3),
('Pulp Fiction', 1994, 'Quentin Tarantino', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY', 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', 8.9),
('The Godfather', 1972, 'Francis Ford Coppola', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'https://www.youtube.com/watch?v=sY1S34973zA', 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', 9.2),
('Fight Club', 1999, 'David Fincher', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 'https://www.youtube.com/watch?v=qtRKdVHc-cE', 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', 8.8),
('Forrest Gump', 1994, 'Robert Zemeckis', 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.', 'https://www.youtube.com/watch?v=bLvqoHBptjg', 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg', 8.8),
('The Matrix', 1999, 'Lana Wachowski, Lilly Wachowski', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 'https://www.youtube.com/watch?v=vKQi3bBA1y8', 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 8.7),
('Interstellar', 2014, 'Christopher Nolan', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 8.6),
('The Lord of the Rings: The Fellowship of the Ring', 2001, 'Peter Jackson', 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.', 'https://www.youtube.com/watch?v=V75dMMIW2B4', 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg', 8.8),
('Gladiator', 2000, 'Ridley Scott', 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', 'https://www.youtube.com/watch?v=owK1qxDselE', 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 8.5),
('The Social Network', 2010, 'David Fincher', 'As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea.', 'https://www.youtube.com/watch?v=lB95KLmpLR4', 'https://m.media-amazon.com/images/M/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE0Mjc1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 7.7),
('Parasite', 2019, 'Bong Joon Ho', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', 'https://www.youtube.com/watch?v=5xH0HfJHsaY', 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg', 8.5),
('The Avengers', 2012, 'Joss Whedon', 'Earth''s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.', 'https://www.youtube.com/watch?v=eOrNdBpGMv8', 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 8.0),
('Titanic', 1997, 'James Cameron', 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.', 'https://www.youtube.com/watch?v=kVrqfYjkTdQ', 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg', 7.8),
('The Wolf of Wall Street', 2013, 'Martin Scorsese', 'Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.', 'https://www.youtube.com/watch?v=iszwuX1AK6A', 'https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_.jpg', 8.2),
('La La Land', 2016, 'Damien Chazelle', 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.', 'https://www.youtube.com/watch?v=0pdqf4P9MB8', 'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_.jpg', 8.0),
('Black Panther', 2018, 'Ryan Coogler', 'T''Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country''s past.', 'https://www.youtube.com/watch?v=xjDjIWPwcPU', 'https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_.jpg', 7.3),
('Dune', 2021, 'Denis Villeneuve', 'Feature adaptation of Frank Herbert''s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.', 'https://www.youtube.com/watch?v=n9xhJrPXop4', 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', 8.0),
('Everything Everywhere All at Once', 2022, 'Daniel Kwan, Daniel Scheinert', 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes connecting with the lives she could have led.', 'https://www.youtube.com/watch?v=wxN1T1uxQ2g', 'https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg', 8.1);

-- Genre-Zuordnungen
INSERT INTO movies_with_genres (movie_id, genre_id) VALUES
(1, 1), (1, 4), (1, 6),  -- The Dark Knight: Action, Drama, Thriller
(2, 1), (2, 3), (2, 4),  -- Inception: Action, Sci-Fi, Drama
(3, 4), (3, 5),          -- Shawshank: Drama, Crime
(4, 4), (4, 5), (4, 6),  -- Pulp Fiction: Drama, Crime, Thriller
(5, 4), (5, 5),          -- Godfather: Drama, Crime
(6, 1), (6, 4), (6, 6),  -- Fight Club: Action, Drama, Thriller
(7, 4), (7, 12),         -- Forrest Gump: Drama, Romance
(8, 1), (8, 3), (8, 7),  -- Matrix: Action, Sci-Fi, Fantasy
(9, 2), (9, 3), (9, 4),  -- Interstellar: Adventure, Sci-Fi, Drama
(10, 2), (10, 7), (10, 1), -- LOTR: Adventure, Fantasy, Action
(11, 1), (11, 2), (11, 14), -- Gladiator: Action, Adventure, History
(12, 4), (12, 13),       -- Social Network: Drama, Biography
(13, 4), (13, 8), (13, 6), -- Parasite: Drama, Comedy, Thriller
(14, 1), (14, 2), (14, 3), -- Avengers: Action, Adventure, Sci-Fi
(15, 4), (15, 12), (15, 14), -- Titanic: Drama, Romance, History
(16, 4), (16, 5), (16, 13), -- Wolf of Wall Street: Drama, Crime, Biography
(17, 4), (17, 8), (17, 12), -- La La Land: Drama, Comedy, Romance
(18, 1), (18, 2), (18, 3),  -- Black Panther: Action, Adventure, Sci-Fi
(19, 2), (19, 3), (19, 7),  -- Dune: Adventure, Sci-Fi, Fantasy
(20, 1), (20, 3), (20, 7);  -- Everything Everywhere: Action, Sci-Fi, Fantasy

-- Schauspieler-Zuordnungen
INSERT INTO movies_with_actors (movie_id, actor_id) VALUES
(1, 3), (1, 4), (1, 7),    -- Dark Knight: Bale, Ledger, Freeman
(2, 2), (2, 13), (2, 15),  -- Inception: DiCaprio, Damon, Hardy
(3, 1), (3, 7),            -- Shawshank: Hanks, Freeman
(4, 8), (4, 9), (4, 14),   -- Pulp Fiction: Pitt, Norton, Travolta
(5, 14), (5, 1),           -- Godfather: Pacino, Brando
(6, 8), (6, 9),            -- Fight Club: Pitt, Norton
(7, 1),                    -- Forrest Gump: Hanks
(8, 10), (8, 7),           -- Matrix: Reeves, Fishburne
(9, 2), (9, 13), (9, 16),  -- Interstellar: McConaughey, Chastain, Hathaway
(10, 11), (10, 18),        -- LOTR: McKellen, Wood
(11, 8), (11, 20),         -- Gladiator: Crowe, Phoenix
(12, 2), (12, 13),         -- Social Network: Eisenberg, Garfield
(13, 12),                  -- Parasite: Song Kang-ho
(14, 5), (14, 6),          -- Avengers: Downey Jr., Johansson
(15, 2), (15, 6),          -- Titanic: DiCaprio, Winslet
(16, 2), (16, 8),          -- Wolf: DiCaprio, Hill
(17, 5), (17, 16),         -- La La Land: Gosling, Stone
(18, 6), (18, 20),         -- Black Panther: Boseman, Jordan
(19, 2), (19, 6),          -- Dune: Chalamet, Zendaya
(20, 5), (20, 16);         -- Everything Everywhere: Yeoh, Curtis


INSERT INTO users (user_id, user_name, password_hash, administrator) VALUES
(1, 'admin', '$2b$10$RMNdw7PdvdnDvnzEUUUp0O8D2oUSzfqdz9ArNLFDks0c.9nVHiuHO', 1);


-- beispiel watchlist
INSERT INTO user_movies (watchlist_id, user_id, movie_id, watched_status) VALUES
(1, 1, 1, TRUE),
(2, 1, 2, TRUE),
(3, 1, 4, FALSE);
