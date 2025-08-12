import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { summarizeArticle } from './api/openAI.js';
import e from 'express';

dotenv.config();
const db_password = process.env.db_password;

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const pool = new Pool({
    user: 'andrewwu',
    host: '127.0.0.1',
    database: 'ai_news',
    password: db_password,
    port: 5432,
});

app.post('/refresh-articles', async (req, res) => {
    exec(`python3 ${process.cwd()}/src/backend/scripts/webscraper.py`, (error, stdout, stderr) => {
        console.log('STDOUT:', stdout);
        console.log('STDERR:', stderr);
        if (error) {
            console.error(`Exec Error: ${error.message}`);
            return res.status(500).json({ error: error.message, stderr });
        }
        if (stderr) console.error(`stderr: ${stderr}`);
        console.log(`stdout: ${stdout}`);
        res.json({ message: 'Articles refreshed' });
    });
});

app.post('/api/summarize', async(req, res) => {
    try {
        const article = req.body;
        const summary = await summarizeArticle(article);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
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
