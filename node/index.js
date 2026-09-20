const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

const heroes = [
  'Bruce Wayne',
  'Clark Kent',
  'Diana Prince',
  'Barry Allen',
  'Arthur Curry',
  'Hal Jordan',
  'Peter Parker',
  'Tony Stark'
];

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'app123',
  database: process.env.DB_NAME || 'nodedb'
};

async function waitForDatabase() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.end();
      console.log('MySQL is ready.');
      return;
    } catch (error) {
      console.log(`Waiting for MySQL... attempt ${attempt}/30`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error('MySQL did not become ready in time.');
}

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    ...dbConfig,
    multipleStatements: true
  });

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS people (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `);

  await connection.end();
}

async function insertHero() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute('SELECT COUNT(*) AS total FROM people');
  const total = Number(rows[0].total || 0);
  const name = heroes[total % heroes.length];

  await connection.execute('INSERT INTO people (name) VALUES (?)', [name]);
  await connection.end();

  return name;
}

async function getPeople() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute('SELECT name FROM people ORDER BY id ASC');
  await connection.end();
  return rows.map((row) => row.name);
}

app.get('/', async (req, res) => {
  try {
    const insertedName = await insertHero();
    const people = await getPeople();
    const listItems = people
      .map((person) => `<li>${person}</li>`)
      .join('');

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Full Cycle Rocks!</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #0f172a;
              color: #e2e8f0;
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: #111827;
              padding: 40px 60px;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }
            h1 {
              color: #facc15;
              margin-bottom: 20px;
              text-align: center;
            }
            p {
              margin-bottom: 20px;
            }
            ul {
              margin: 0;
              padding-left: 22px;
            }
            li {
              margin: 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Full Cycle Rocks!</h1>
            <p>Último nome inserido: <strong>${insertedName}</strong></p>
            <ul>${listItems}</ul>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).send('Erro ao processar a requisição.');
  }
});

(async () => {
  try {
    await waitForDatabase();
    await initializeDatabase();

    app.listen(port, '0.0.0.0', () => {
      console.log(`Application running on port ${port}`);
    });
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
})();
