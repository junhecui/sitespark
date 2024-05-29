const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for all routes

app.use(express.json());

app.use('/api/projects', require('./routes/projects'));

app.get('/', (req, res) => {
  res.send('Low-Code Platform Backend');
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
