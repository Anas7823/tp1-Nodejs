const express = require('express');
const app = express();
const mariadb = require('mariadb');
require('dotenv').config();
let cors = require('cors');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

app.use(express.json());
app.use(cors());

// CRUD utilisateur
app.get('/utilisateur', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    await conn.query('SELECT * FROM utilisateur');
    const rows = await conn.query('SELECT * FROM utilisateur');
    res.send(rows);
});

app.get('/utilisateur/:id', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    await conn.query('SELECT * FROM utilisateur WHERE id = ?', [req.params.id]);
    const rows = await conn.query('SELECT * FROM utilisateur');
    res.send(rows);
});

app.post('/utilisateur', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    await conn.query('INSERT INTO utilisateur (nom, prenom, email) VALUES (?, ?, ?)', [req.body.nom, req.body.prenom, req.body.email]);
    const rows = await conn.query('SELECT * FROM utilisateur');
    res.status(201).json(rows);
});

app.put('/utilisateur/:id', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    await conn.query('UPDATE utilisateur SET nom = ?, prenom = ?, email = ? WHERE id = ?', [req.body.nom, req.body.prenom, req.body.email, req.params.id]);
    const rows = await conn.query('SELECT * FROM utilisateur');
    res.send(rows);
});

app.delete('/utilisateur/:id', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    await conn.query('DELETE FROM utilisateur WHERE id = ?', [req.params.id]);
    const rows = await conn.query('SELECT * FROM utilisateur');
    res.send(rows);
});
// Fin CRUD User

// voir toute les technologies
app.get('/technologie', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    await conn.query('SELECT * FROM technologie');
    const rows = await conn.query('SELECT * FROM technologie');
    res.send(rows);
});

// voir une technologie
app.get('/technologie/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let id = req.params.id;
        const rows = await conn.query('SELECT * FROM technologie WHERE id = ?', id);
        res.send(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        res.status(500).send('Erreur lors de la récupération des données');
    } finally {
        if (conn) conn.release(); // Libérez la connexion dans tous les cas
    }
});

// afficher tout les commentaires
app.get('/commentaire', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    await conn.query('SELECT * FROM commentaire');
    const rows = await conn.query('SELECT * FROM commentaire');
    res.send(rows);
});

// Affichez tous les messages écrit par un utilisateur donné
app.get('/commentaires/user/:id_user', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    let id_user = req.params.id_user;
    const rows = await conn.query('SELECT * FROM commentaire WHERE id_user = ?', id_user);
    res.send(rows);
});

// afficher les commentaires dont la date sera antérieure à celle mis en paramètre​
app.get('/commentaires/date/:date', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    let date = req.params.date;
    const rows = await conn.query('SELECT * FROM commentaire WHERE date_creation < ?', date);
    res.send(rows);
});

// afficher les commentaires d'une technologie
app.get('/commentaires/technologie/:id_tech', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    let id_tech = req.params.id_tech;
    const rows = await conn.query('SELECT * FROM commentaire WHERE id_tech = ?', id_tech);
    res.send(rows);
});
// poster un commentaire
app.post('/commentaires/:id_tech', async (req, res) => {
    let conn;
    let id_tech = req.params.id_tech;
    let id_user = req.body.id_user;
    let date = new Date();
    conn = await pool.getConnection();
    const rows = await conn.query('INSERT INTO commentaire (commentaire, date_creation, id_user, id_tech) VALUES (?, ?, ?, ?)', [req.body.commentaire, date, id_user, id_tech]);
    
    // Convertir les BigInt en String
    const rowsStringified = JSON.parse(JSON.stringify(rows, (key, value) => 
        typeof value === 'bigint' ? value.toString() : value
    ));

    res.status(201).json(rowsStringified);
});


port = 8000;
app.listen(port, () =>
    console.log(`Serveur lancé sur http://localhost:${port}`)
);