const express = require('express');
const router = express.Router();
const { session } = require('../db/neo4j');

// Route to create a new widget
router.post('/widget', async (req, res) => {
  const { id, type, data, pageId } = req.body;

  try {
    const result = await session.run(
      'MATCH (p:Page {id: $pageId}) CREATE (w:Widget {id: $id, type: $type, data: $data})-[:BELONGS_TO]->(p) RETURN w',
      { id, type, data: JSON.stringify(data), pageId }
    );
    const widget = result.records[0].get('w').properties;
    res.status(201).json(widget);
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all widgets for a specific page
router.get('/widgets', async (req, res) => {
  const { pageId } = req.query;

  try {
    const result = await session.run(
      'MATCH (w:Widget)-[:BELONGS_TO]->(p:Page {id: $pageId}) RETURN w',
      { pageId }
    );
    const widgets = result.records.map(record => {
      const widget = record.get('w').properties;
      widget.data = JSON.parse(widget.data);
      return widget;
    });
    res.status(200).json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a widget by its ID
router.delete('/widget/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await session.run('MATCH (w:Widget {id: $id}) DELETE w', { id });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to update a widget
router.put('/widget/:id', async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const result = await session.run(
      'MATCH (w:Widget {id: $id}) SET w.data = $data RETURN w',
      { id, data }
    );
    const widget = result.records[0].get('w').properties;
    res.status(200).json(widget);
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete all widgets for a specific page
router.delete('/widgets', async (req, res) => {
  const { pageId } = req.query;

  try {
    await session.run(
      'MATCH (w:Widget)-[:BELONGS_TO]->(p:Page {id: $pageId}) DELETE w',
      { pageId }
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting widgets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
