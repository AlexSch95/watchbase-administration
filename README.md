<p align="center">
    <img src="https://i.imgur.com/ZplQ9Sf.png" alt="Logo" height=72>
  <p align="center">
    Administrationstool für Watchbase
  </p>
</p>


## Inhaltsverzeichnis

- [Tech-Stack](#tech-stack)
- [Entwicklungsstatus](#entwicklungsstatus)
- [Einrichtung](#einrichtung)
- [Projektstruktur](#projektstruktur)

## Tech-Stack

![image](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) ![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white) ![image](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![image](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)  ![image](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![image](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) ![image](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## Entwicklungsstatus
Fortschritt: 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟥🟥🟥 (85%)

## Einrichtung

1. Clone dir dieses Repository
2. Navigiere in den Ordner "backend" mit `cd backend`
3. führe `npm install` aus
4. Navigiere in den Ordner "db-example-data" mit `cd db-example-data`
5. Melde dich am MySQL Dienst an via `mysql -u root -p`
6. Bestätige ohne ein Kennwort einzugeben
7. Lege die Datenbank und ihre Tabellen an mit: `source database-setup.sql`
8. Füge Beispieldaten in die Datenbank ein: `source example-data.sql`
9. Navigiere zurück in den Ordner "backend" mit `cd ..`
10. Starte das Backend mit `node backendprocess.js` oder `nodemon backendprocess.js`
11. Melde dich mit dem vorab erstellten Administrator-Account an, Benutzername: `admin` - Kennwort: `admin`


## Projektstruktur

```
Projektverzeichnis/
├── frontend/
│   ├── index.html
│   ├── overview.html
│   ├── addmovie.html
│   ├── addactor.html
│   ├── addgenre.html
│   └── inspect-user.html
├── scripts/
│   ├── index.js
│   ├── overview.js
│   ├── addmovie.js
│   ├── addactor.js
│   ├── addgenre.js
│   └── inspect-user.js
├── backend/
│   ├── db-example-data/
|   |   ├── database-setup.sql
|   |   └── example-data.sql
│   ├── backendprocess.js
│   ├── db.js
│   ├── package-lock.json
│   └── package.json
└── assets/
    ├── css/
    |   └── styles.css
    └── img/
        ├── avatar-placeholder.png
        └── background-image.jpg
```
