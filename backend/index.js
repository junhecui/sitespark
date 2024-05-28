// backend/index.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Low-Code Platform Backend');
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
