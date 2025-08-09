import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();
const db_password = process.env.db_password;

const app = express();
app.use(cors({ origin: '*' }));

const pool = new Pool({
    user: 'andrewwu',
    host: '127.0.0.1',
    database: 'ai_news',
    password: db_password,
    port: 5432,
});

app.get('/articles', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM articles ORDER BY date_published DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database query error' });
    }
});

app.listen(5001, () => console.log('Server running on port 5001'));


//database has items, present something to frontend
//when fetch, internal operation, server prepares data, create connection pool to database
//then get select, update... once data is got, give data to http
//
//database is connection pool call, not http