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
    conn = await pool.getConnection();
    let id_techno = req.params.id;
    await conn.query('SELECT * FROM technologie WHERE id = ?', id_techno);
    const rows = await conn.query('SELECT * FROM technologie');
    res.send(rows);
    app.get('/commentaire', async (req, res) => {
        let conn;
        conn = await pool.getConnection();
        await conn.query('SELECT * FROM commentaire where id_tech = ?', id_techno);                  
        const rows = await conn.query('SELECT * FROM commentaire');
        res.send(rows);
    });
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
    await conn.query('SELECT * FROM commentaire WHERE id_user = ?', id_user);
    const rows = await conn.query('SELECT * FROM commentaire');
    res.send(rows);
});

// afficher les commentaires dont la date sera antérieure à celle mis en paramètre​
app.get('/commentaires/date/:date', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    let date = req.params.date;
    await conn.query(
        'SELECT * FROM commentaire ' +
        'INNER JOIN user_commentaire ON commentaire.id = user_commentaire.id_com ' +
        'INNER JOIN utilisateur ON user_commentaire.id_utilisateur = utilisateur.id ' +
        'INNER JOIN technologie ON user_commentaire.id_technologie = technologie.id ' +
        'WHERE commentaire.date < ?',
        date
    );
    const rows = await conn.query('SELECT * FROM commentaire');
    res.send(rows);
});

// poster un commentaire
app.post('/commentaires/:id_tech', async (req, res) => {
    let conn;
    let id_tech = req.params.id_tech;
    conn = await pool.getConnection();
    await conn.query('INSERT INTO commentaire (commentaire, date) VALUES (?, ?)', [req.body.commentaire, req.body.date]);
    const rows = await conn.query('SELECT * FROM commentaire');
    res.status(201).json(rows);
});

port = 8000;
app.listen(port, () =>
    console.log(`Serveur lancé sur http://localhost:${port}`)
);