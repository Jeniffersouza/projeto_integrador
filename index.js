
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3000;


// Adicione este middleware para lidar com CORS
app.use(cors());

// Configuração do banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_ajuda_ai',
  connectionLimit: 10,
});

// Middleware para lidar com o corpo da solicitação JSON
app.use(express.json());

// Rota de registro de usuário
app.post('/register', async (req, res) => {
  const { cpf, email, password, name } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.query('INSERT INTO usuarios (cpf, email, password, name) VALUES (?, ?, ?, ?)', [cpf, email, password, name]);
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    connection.release();
  }
});

app.post('/login', async (req, res) => {
    const { cpf, password } = req.body;
    const connection = await pool.getConnection();
  
    try {
      const [rows] = await connection.query('SELECT id FROM usuarios WHERE cpf = ? AND password = ?', [cpf, password]);
  
      if (rows.length === 0) {
        res.status(401).json({ error: 'Login unsuccessful' });
      } else {
        const userId = rows[0].id; // Obtém o ID do usuário da consulta
        res.json({ message: 'Login successful', userId: userId });
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      connection.release();
    }
  });




// Rota para obter todos os serviços
// Rota para obter todos os serviços de um usuário específico
app.get('/services', async (req, res) => {
    const { user_id } = req.query;
  
    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id parameter' });
    }
  
    const connection = await pool.getConnection();
  
    try {
      const [rows] = await connection.query('SELECT * FROM servicos WHERE user_id = ?', [user_id]);
      const services = rows.map(service => ({
        id: service.id,
        user_id: service.user_id,
        service_name: service.service_name,
        value: service.value,
        description: service.description,
      }));
      res.json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      connection.release();
    }
  });
  

// ...

// Rota para cadastrar um novo serviço
app.post('/services', async (req, res) => {
    const { service_name, value, description, user_id } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.query('INSERT INTO servicos (service_name, value, description, user_id) VALUES (?, ?, ?, ?)', [service_name, value, description, user_id]);
        res.json({ message: 'Service added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.release();
    }
});


// Rota para obter todos os serviços
app.get('/all-services', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query('SELECT * FROM servicos');
      const services = rows.map(service => ({
        id: service.id,
        user_id: service.user_id,
        service_name: service.service_name,
        value: service.value,
        description: service.description,
      }));
      res.json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      connection.release();
    }
  });

  
// Lidar com CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
