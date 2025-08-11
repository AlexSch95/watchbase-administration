const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { connectToDatabase } = require("./db.js");
const bcrypt = require("bcrypt");
require('dotenv').config()
const jwt=require("jsonwebtoken")

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const VIEWS_DIR = Path2D.join(__dirname, 'views');
const secretKey = process.env.JWT_SECRET

app.get('/api/overview/db-stats', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    // Liste der relevanten Tabellen
    const tables = [
      'actors', 
      'genres', 
      'movies', 
      'movies_with_actors', 
      'movies_with_genres', 
      'user_movies', 
      'users'
    ];

    // Erstelle ein Array von COUNT(*) Queries mit Tabellennamen
    const queries = tables.map(table => 
      connection.execute(
        `SELECT ? AS tableName, COUNT(*) AS rowCount FROM \`${table}\``,
        [table]
      )
    );

    // Führe alle Queries parallel aus
    const results = await Promise.all(queries);
    
    // Ergebnisse in ein flaches Array umwandeln
    const stats = results.flatMap(result => result[0]);

    await connection.end();
    
    res.status(200).json(stats);

  } catch (error) {
    console.error('Fehler beim Abrufen der Tabellenstatistiken:', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler',
      error: error.message
    });
  } 
});

app.post("/api/genres/add", async (req, res) => {
  try {
    const {genres} = req.body;

    if (!genres || !Array.isArray(genres)) {
      return res.status(400).json({success: false, message: "Genres müssen als Array übergeben werden"});
    }

    if (genres.length === 0) {
      return res.status(400).json({success: false, message: "Es wurden keine Genres übergeben"})
    }

    const connection = await connectToDatabase();
    const [existingGenres] = await connection.query("SELECT genre_name FROM genres WHERE genre_name IN (?)", [genres]);
    console.log(existingGenres);
    const existingNames = existingGenres.map(genre => genre.genre_name);
    const newGenres = genres.filter(genre => !existingNames.includes(genre));

    if (newGenres.length > 0) {
      const genreValues = newGenres.map(genre => [genre]);
      await connection.query("INSERT INTO genres (genre_name) VALUES ?", [genreValues]);
    }
    await connection.end();
    res.status(201).json({
      success: true,
      message: newGenres.length > 0 
      ? `Neue Genres hinzugefügt: ${newGenres.join(", ")}` 
      : "Alle Genres existieren bereits"
    });
  } catch (error) {
    return res.status(500).json({success: false, message: "Ein Fehler ist aufgetreten"})
  }
})

app.post("/api/actors/add", async (req, res) => {
  try {
    const {actors} = req.body;

    if (!actors || !Array.isArray(actors)) {
      return res.status(400).json({success: false, message: "Actors müssen als Array übergeben werden"});
    }

    if (actors.length === 0) {
      return res.status(400).json({success: false, message: "Es wurden keine Actors übergeben"})
    }

    const connection = await connectToDatabase();
    const [existingActors] = await connection.query("SELECT actor_name FROM actors WHERE actor_name IN (?)", [actors]);
    console.log(existingActors);
    const existingNames = existingActors.map(actor => actor.actor_name);
    const newActors = actors.filter(actor => !existingNames.includes(actor));

    if (newActors.length > 0) {
      const actorValues = newActors.map(actor => [actor]);
      await connection.query("INSERT INTO actors (actor_name) VALUES ?", [actorValues]);
    }
    await connection.end();
    res.status(201).json({
      success: true,
      message: newActors.length > 0 
      ? `Neue Actors hinzugefügt: ${newActors.join(", ")}` 
      : "Alle Actors existieren bereits"
    });
  } catch (error) {
    return res.status(500).json({success: false, message: "Ein Fehler ist aufgetreten"})
  }
})


app.post("/api/admin/login", async (req, res) => {
  try {
    // Username und Passwort auslesen
    const {username, password} = req.body;
    if (username === undefined || password === undefined) {
      return res.status(400).json({ error: "Username oder Passwort nicht übergeben." });
    }
    const connection = await connectToDatabase();
    // Überprüfe, ob Username existiert
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE user_name = ?', [username]
    );
    await connection.end();
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: "Username existiert nicht." });
    }
    // existingUsers = [user0, user1, ...]
    const user = existingUsers[0];
    const passwordHash = user.password_hash;
    // Ab hier: Passwort-Hash überprüfen
    const passwordCorrect = await bcrypt.compare(password, passwordHash);
    if (passwordCorrect === false) {
      return res.status(401).json({success: false, message: "Passwort nicht korrekt."});
    } else if (user.administrator !== 1) {
      return res.status(401).json({success: false, message: "Benutzer hat keine Administratorrechte"})
    }
    // Objekt erstellen, das in unserem token mit jsonwebtoken gesigned wird
    const tokenUser = {
      id: user.user_id,
      username: user.user_name,
      adminRole: user.administrator
    }
    //erstellen des verschlüsselten Tokens mit jwt.sign
    const token = jwt.sign(tokenUser, secretKey, { expiresIn: '1h' });
    //antwort ans frontend inklusive des erstellten, verschlüsselten tokens
    res.status(200).json({
      success: true,
      message: `User ${username} erfolgreich eingeloggt.`,
      token: token,
      userName: user.user_name
    })
    
  } catch (error) {
    return res.status(500).json({ error: "Fehler beim überprüfen des Passworts." });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader){
    return res.status(401).json({ error: "Kein Token" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.adminRole !== 1) {
      throw new Error("Keine Admin-Berechtigung"); // Löst den catch-Block aus
    }
    req.user = decoded.username;
    req.id = decoded.id;
    req.adminRole = decoded.adminRole
    next();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function checkAdminPrivilege(req, res, next) {
  try {
    const connection = await connectToDatabase();
    const [rows] = connection.execute('SELECT adminRole FROM users WHERE id = ?', [req.user.id]);
    await connection.end();
    if (rows.length === 0 || rows[0].adminRole !== 1) {
      return res.status(403).json({success: false, message: "Admin-Berechtigung erforderlich"})
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: "Datenbankfehler"})
  }
}

app.get("/api/actors", async (req, res)=>{
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM actors ORDER BY actor_name;')
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({error: "Fehler beim Laden der Schauspieler"});
  }
})

app.get("/api/genres", async (req, res)=>{
try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM genres ORDER BY genre_name;')
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({error: "Fehler beim Laden der Genres"});
  }
})

app.post("/api/admin/addmovie", async (req, res) => {
  try {
    //destructuring des Request Body
    const { title, release_year, director,
        short_description, trailer_url,
        poster, rating, genres, actors }
        = req.body;
    console.log(genres, actors);
    if (genres.length === 0 || actors.length === 0) {
      console.log("1");
      return res.status(400).json({success: false, message: "Genre und Schauspieler muss mindestens eine Auswahl haben."})
    }
    //Datenbank Verbindung aufbauen
    const connection = await connectToDatabase();

    //Prüfen ob schon ein Film mit dem Titel vorhanden ist, falls ja Abbruch
    const [checkMovieTitle] = await connection.execute('SELECT * FROM movies WHERE title = ?', [title])
    if (checkMovieTitle.length > 0) {
      return res.status(400).json({success: false, message: "Film mit diesem Namen existiert bereits"});
    }
    //Query fürs einfügen des Films wird vorbereitet
    const movieQuery = `INSERT INTO movies 
              (title, release_year, director, short_description, trailer_url, poster, rating)
              VALUES
              (?, ?, ?, ?, ?, ?, ?)`
    //Array mit den Werten die eingefügt werden wird vorbereitet
    const movieData = [title, release_year, director, short_description, trailer_url, poster, rating];
    //Query ausführen
    const [addedMovie] = await connection.execute(movieQuery, movieData);
    //Die ID mit der der neue Film hinzugefügt wurde zwischenspeichern
    const addedMovieId = addedMovie.insertId;

    //Generiere Dynamische Querys für Genres und Actors (da beliebig viele Genres und Actors pro Film eingetragen werden können)
    const selectedGenresQuery = generateGenresSearchQuery(genres);
    const selectedActorsQuery = generateActorSearchQuery(actors);

    //Führe die Querys aus um die IDs zu den jeweiligen Genres zu erhalten um sie für die Kreuztabellen weiterzuverwenden
    const [selectedGenres] = await connection.execute(selectedGenresQuery, genres);
    const [selectedActors] = await connection.execute(selectedActorsQuery, actors)

    //Generiere Dynamische Querys um Genres und Actors in die Kreuztabellen einzufügen
    const [genreRelationQuery, genreRelationData] = generateGenreRelationQuery(selectedGenres, addedMovieId);
    const [actorRelationQuery, actorRelationData] = generateActorRelationQuery(selectedActors, addedMovieId);
    
    //Führe die Querys aus um die Genre-Film-Beziehung einzutragen
    const [addedGenreRelation] = await connection.execute(genreRelationQuery, genreRelationData);
    const [addedActorRelation] = await connection.execute(actorRelationQuery, actorRelationData)
    await connection.end();
    res.status(200).json({success: true, message: `Film wurde erfolgreich hinzugefügt mit der ID ${addedMovieId}`})
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: "Ein Fehler ist aufgetreten"})
  }
})


function generateActorSearchQuery(actors) {
  //legt den Anfang der Query fest, die Query gibt alle Actors mit ihren IDs zurück, die denen entsprechen die ans Backend geschickt wurden
  let selectedActorsQuery = 'SELECT actor_id, actor_name FROM actors WHERE actor_name IN('
  //für jeden Actor im Array (das aus dem Request Body kommt) wird ein ?, an die Query konkateniert
  actors.forEach(actor => {
    selectedActorsQuery += "?,"
  })
  //letztes Komma wird weggesliced
  selectedActorsQuery = selectedActorsQuery.slice(0, -1);
  //Query wird mit der Klammer geschlossen für korrekte Syntax
  selectedActorsQuery += ");"
  console.log("Actor Search Query:", selectedActorsQuery);
  return selectedActorsQuery;
}

function generateGenresSearchQuery(genres) {
  let selectedGenresQuery = 'SELECT genre_id, genre_name FROM genres WHERE genre_name IN('
  genres.forEach(genre => {
    selectedGenresQuery += "?,"
  })
  selectedGenresQuery = selectedGenresQuery.slice(0, -1);
  selectedGenresQuery += ");"
  console.log("Genre Search Query:", selectedGenresQuery);
  return selectedGenresQuery;
}

function generateGenreRelationQuery(genres, movieId) {
  let genreRelationQuery = "INSERT INTO movies_with_genres (movie_id, genre_id) VALUES "
  let genreRelationData = [];
  genres.forEach(genre => {
    genreRelationQuery += `(?, ?),`
    genreRelationData.push(movieId, genre.genre_id)
  })
  genreRelationQuery = genreRelationQuery.slice(0, -1);
  console.log("Genre Relation Query:", genreRelationQuery);
  console.log("Genre Relation Data:", genreRelationData);
  return [genreRelationQuery, genreRelationData]
}

function generateActorRelationQuery(actors, movieId) {
  let actorRelationQuery = "INSERT INTO movies_with_actors (movie_id, actor_id) VALUES "
  let actorRelationData = [];
  //für jeden übermittelten Actor wird (?, ?) an die Query angehängt und im Array die movieId und die actor_id abgespeichert
  actors.forEach(actor => {
    actorRelationQuery += `(?, ?),`
    actorRelationData.push(movieId, actor.actor_id)
  })
  //slice schneidet ganz hinten das letzte Komma ab, da sonst die SQL Syntax nichtmehr sauber ist
  actorRelationQuery = actorRelationQuery.slice(0, -1);
  console.log("Actor Relation Query:", actorRelationQuery);
  console.log("Actor Relation Data:", actorRelationData);
  //ReturnValues als Array, diese werden in der Route destructured
  return [actorRelationQuery, actorRelationData]
}

app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
