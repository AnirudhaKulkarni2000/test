const express = require('express');

const app = express();
app.use(express.json());

// In-memory "database"
const todos = [
  { id: 1, title: 'Write a Dockerfile', done: false },
  { id: 2, title: 'Create a Jenkinsfile', done: false },
];

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from simple-node-app!',
    version: process.env.APP_VERSION || 'dev',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Health check - useful for Docker HEALTHCHECK and deploy verification
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { title } = req.body || {};
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  const todo = { id: todos.length + 1, title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

module.exports = app;
