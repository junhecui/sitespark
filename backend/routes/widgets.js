const express = require('express');
const router = express.Router();
const { session } = require('../db/neo4j');

router.post('/widget', async (req, res) => {
  const { type, data } = req.body;
  try {
    const result = await session.run(
      'CREATE (w:Widget {type: $type, data: $data}) RETURN w',
      { type, data }
    );
    res.status(201).json(result.records[0].get('w').properties);
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ error: error.message });
  }
});

// Existing routes
router.get('/widgets', async (req, res) => {
  try {
    const result = await session.run('MATCH (w:Widget) RETURN w');
    const widgets = result.records.map(record => record.get('w').properties);
    res.status(200).json(widgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
