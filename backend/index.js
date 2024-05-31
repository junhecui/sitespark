const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const widgetRoutes = require('./routes/widgets');
const { driver } = require('./db/neo4j'); 
require('dotenv').config({ path: '../.env' });

const app = express();

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.use('/api', widgetRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  try {
    // Verify database connection
    await driver.verifyConnectivity();
    console.log('Connected to Neo4j');
  } catch (error) {
    console.error('Neo4j connection error:', error);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});
