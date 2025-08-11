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

const secretKey = process.env.JWT_SECRET

//Middleware: JWT Token verify
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader){
    return res.status(401).json({success: false, message: "Token wurde nicht übermittelt."});
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.adminRole !== 1) {
      return res.status(403).json({
        success: false, 
        message: "JWT Token ist gültig aber enthält keine gültige Administratorrolle."
      })
    }
    req.user = decoded.username;
    req.id = decoded.id;
    req.adminRole = decoded.adminRole
    next();
  } catch (error) {
    console.error(`Fehler in Middleware "authenticateToken": ${error}`);
    console.log(error);
    if (error.message.includes("jwt malformed")) {
      return res.status(400).json({
        success: false,
        message: "Ungültiger oder abgelaufener Token wurde übermittelt."
      })
    }
    res.status(500).json({
      success: false, 
      message: "Interner Severfehler, Systemadministrator kontaktieren."
    })
  }
}

//Adminprivileges Middleware, returnt http 403 wenn administrator = 0 für den eingeloggten User
async function checkAdminPrivilege(req, res, next) {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT administrator FROM users WHERE user_id = ?', [req.id]);
    await connection.end();
    if (rows.length === 0 || rows[0].administrator !== 1) {
      return res.status(403).json({
        success: false, 
        message: "Benutzer hat keine Administratorberechtigung."
      })
    }
    next();
  } catch (error) {
    console.error(`Fehler in Middleware "checkAdminPrivilege": ${error}`);
    res.status(500).json({
      success: false, 
      message: "Interner Severfehler, Systemadministrator kontaktieren."
    })
  }
}

//Login-Route - Anmeldung im Adminsystem nur mit entsprechender Administratorrolle möglich
app.post("/api/admin/login", async (req, res) => {
  try {
    const {username, password} = req.body;
    if (username === undefined || password === undefined) {
      return res.status(400).json({
        success: false,
        message: "Kein Benutzername oder Passwort übermittelt."
      });
    }
    const connection = await connectToDatabase();
    // Überprüfe, ob Username existiert
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE user_name = ?', [username]
    );
    await connection.end();
    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Es existiert kein Benutzer mit diesem Benutzernamen."
      });
    }
    const user = existingUsers[0];
    const passwordHash = user.password_hash;
    // Ab hier: Passwort-Hash überprüfen
    const passwordCorrect = await bcrypt.compare(password, passwordHash);
    if (passwordCorrect === false) {
      return res.status(401).json({
        success: false, 
        message: "Das eingegebene Passwort ist nicht korrekt."
      });
    } else if (user.administrator !== 1) {
      return res.status(401).json({
        success: false, 
        message: "Benutzer hat keine Administratorberechtigung."
      })
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
      message: `Anmeldung als ${username} erfolgreich.`,
      token: token,
      userName: user.user_name
    })
    
  } catch (error) {
    console.error(`Fehler in Route "/api/admin/login": ${error}`);
    res.status(500).json({
      success: false, 
      message: "Interner Severfehler, Systemadministrator kontaktieren."
    })
  }
});

//Route um Statistiken über die Datenbank abzurufen mit Middleware zur Tokenprüfung und Berechtigungsprüfung
app.get('/api/overview/db-stats', authenticateToken, checkAdminPrivilege, async (req, res) => {
  try {
    const tables = [
      'actors', 
      'genres', 
      'movies', 
      'movies_with_actors', 
      'movies_with_genres', 
      'user_movies', 
      'users'
    ];
    // Erstellt ein Array von COUNT(*) Queries mit Tabellennamen
    const connection = await connectToDatabase();
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
    res.status(200).json({
      success: true,
      message: "Statistiken erfolgreich abgerufen",
      data: stats
    });
  } catch (error) {
    console.error('Fehler in Route "/api/overview/db-stats"', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler, Systemadministrator kontaktieren.',
    });
  } 
});

//Route um Genres hinzuzufügen mit Middleware zur Tokenprüfung und Berechtigungsprüfung
app.post("/api/genres/add", authenticateToken, checkAdminPrivilege, async (req, res) => {
  try {
    const {genres} = req.body;
    //Wenn keine Genres oder die Genres nicht als Array übergeben wurden
    if (!genres || !Array.isArray(genres)) {
      return res.status(400).json({
        success: false, 
        message: "Es wurden Fehlerhafte Daten übergeben. Falls dieses Problem weiterhin besteht kontaktieren Sie den Systemadministrator"
      });
    }
    const connection = await connectToDatabase();
    // SQL Query holt sich die genre_name Spalte für alle Genres die im Request übergeben wurden, aber schon in der DB existieren
    const [existingGenres] = await connection.query("SELECT genre_name FROM genres WHERE genre_name IN (?)", [genres]);
    //erstellt ein Array mit allen Genrenamen die bereits vorhanden sind
    const existingNames = existingGenres.map(genre => genre.genre_name);
    // filtert die im Request übergebenen Genres und fügt nur die zu "newGenres" hinzu, die laut Datenbankabfrage noch nicht vorhanden sind
    const newGenres = genres.filter(genre => !existingNames.includes(genre));
    //wenn mehr als 1 Genre noch nicht vorhanden ist, wird der jeweilige Genre Name in das neue Array genreValues gepackt
    //allerdings als Array, die map funktion unten macht quasi ein Array in dem für jedes Genre ein Array enthalten ist
    //indem dann der Genrename steht, wird benötigt um connection.query zum übermitteln zu nutzen
    if (newGenres.length > 0) {
      const genreValues = newGenres.map(genre => [genre]);
      //für jeden Eintrag im array genreValues wird die Query ausgeführt und das Genre in der DB eingesetzt
      await connection.query("INSERT INTO genres (genre_name) VALUES ?", [genreValues]);
    }
    await connection.end();
    //Modulare Rückmeldung, wenn newGenres mehr als 1 werden die Genres die hinzugefügt wurden in der message übermittelt, ansonsten
    // dass bereits alle existieren
    res.status(201).json({
      success: true,
      message: newGenres.length > 0 
      ? `Neue Genres hinzugefügt: ${newGenres.join(", ")}, Nicht hinzugefügt weil bereits existent: ${existingNames.join(", ")}.` 
      : "Alle Genres existieren bereits"
    });
  } catch (error) {
    console.error('Fehler in Route "/api/genres/add"', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler, Systemadministrator kontaktieren.',
    });
  }
})

//Route um Schauspieler hinzuzufügen mit Middleware zur Tokenprüfung und Berechtigungsprüfung
app.post("/api/actors/add", authenticateToken, checkAdminPrivilege, async (req, res) => {
  try {
    const {actors} = req.body;

    if (!actors || !Array.isArray(actors)) {
      return res.status(400).json({
        success: false, 
        message: "Es wurden Fehlerhafte Daten übergeben. Falls dieses Problem weiterhin besteht kontaktieren Sie den Systemadministrator"
      });
    }

    const connection = await connectToDatabase();
    const [existingActors] = await connection.query("SELECT actor_name FROM actors WHERE actor_name IN (?)", [actors]);
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
      ? `Neue Schauspieler hinzugefügt: ${newActors.join(", ")}, Nicht hinzugefügt weil bereits existent: ${existingNames.join(", ")}.` 
      : "Alle Schauspieler existieren bereits"
    });
  } catch (error) {
    console.error('Fehler in Route "/api/actors/add"', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler, Systemadministrator kontaktieren.',
    });
  }
})

//Route um alle Schauspieler zu laden mit Middleware zur Tokenprüfung und Berechtigungsprüfung
app.get("/api/actors/get-all", authenticateToken, checkAdminPrivilege, async (req, res)=>{
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM actors ORDER BY actor_name;')
    await connection.end();
    res.status(200).json({
      success: true, 
      message: "Alle Schauspieler wurden erfolgreich geladen.",
      data: rows
    });
  } catch (error) {
    console.error('Fehler in Route "/api/actors/get-all"', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler, Systemadministrator kontaktieren.',
    });
  }
})

//Route um alle Genres zu laden mit Middleware zur Tokenprüfung und Berechtigungsprüfung
app.get("/api/genres/get-all", authenticateToken, checkAdminPrivilege, async (req, res)=>{
try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM genres ORDER BY genre_name;')
    await connection.end();
    res.status(200).json({
      success: true, 
      message: "Alle Genres wurden erfolgreich geladen.",
      data: rows
    });
  } catch (error) {
    console.error('Fehler in Route "/api/genres/get-all"', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler, Systemadministrator kontaktieren.',
    });
  }
})

//Route einen Neuen Film zur Datenbank hinzuzufügen mit Middleware zur Tokenprüfung und Berechtigungsprüfung
app.post("/api/movies/add", authenticateToken, checkAdminPrivilege, async (req, res) => {
  try {
    //destructuring des Request Body
    const { title, release_year, director,
        short_description, trailer_url,
        poster, rating, genres, actors }
        = req.body;
    if (genres.length === 0 || actors.length === 0) {
      return res.status(400).json({
        success: false, 
        message: "Es muss mindestens ein Genre und ein Schauspieler für einen Film ausgewählt werden."
      })
    }
    //Datenbank Verbindung aufbauen
    const connection = await connectToDatabase();

    //Prüfen ob schon ein Film mit dem Titel vorhanden ist, falls ja Abbruch
    const [checkMovieTitle] = await connection.execute('SELECT * FROM movies WHERE title = ?', [title])
    if (checkMovieTitle.length > 0) {
      return res.status(409).json({
        success: false, 
        message: "Es existiert bereits ein Film mit diesem Namen."
      });
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
    res.status(201).json({
      success: true, 
      message: `Der Film wurde erfolgreich hinzugefügt.`})
  } catch (error) {
    console.error('Fehler in Route "/api/movies/add"', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler, Systemadministrator kontaktieren.',
    });
  }
})

//Helper Functions für Query Generierung anhand von dynamischen Daten
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
