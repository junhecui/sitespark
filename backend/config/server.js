const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const widgetRoutes = require('../routes/widgets');
const websiteRoutes = require('../routes/websites');
const pageRoutes = require('../routes/pages');
const authRoutes = require('../routes/auth');
const { driver } = require('../db/neo4j');
require('dotenv').config();

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', widgetRoutes);
app.use('/api', websiteRoutes);
app.use('/api', pageRoutes);
app.use('/api/auth', authRoutes.router);

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  try {
    await driver.verifyConnectivity();
    console.log('Connected to Neo4j');
  } catch (error) {
    console.error('Neo4j connection error:', error);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});