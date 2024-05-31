const express = require('express');
const router = express.Router();
const { session } = require('../db/neo4j');

router.delete('/widget/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await session.run('MATCH (w:Widget {id: $id}) DELETE w', { id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/widget', async (req, res) => {
  const { type, data } = req.body;
  try {
    const result = await session.run(
      'CREATE (w:Widget {type: $type, data: $data}) RETURN w',
      { type, data }
    );
    res.status(201).json(result.records[0].get('w').properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
