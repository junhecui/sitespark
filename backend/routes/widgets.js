const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { session } = require('../db/neo4j');
const upload = require('../middlewares/upload');
const { authenticateJWT } = require('./auth');

router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.location });
});

// Route to create a new widget within a page
router.post('/page/:pageId/widget', authenticateJWT, async (req, res) => {
  const { pageId } = req.params;
  const { type, data, position = { x: 0, y: 0 }, size = { width: 200, height: 200 } } = req.body;
  const userId = req.user.id;

  try {
    console.log("Creating widget with data:", { pageId, type, data, position, size, userId });
    const result = await session.run(
      'MATCH (p:Page {id: $pageId, userId: $userId}) CREATE (w:Widget {id: $id, type: $type, data: $data, position: $position, size: $size, userId: $userId})-[:BELONGS_TO]->(p) RETURN w',
      { pageId, id: uuidv4(), type, data: JSON.stringify(data), position: JSON.stringify(position), size: JSON.stringify(size), userId }
    );
    const widget = result.records[0].get('w').properties;
    res.status(201).json(widget);
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to update a widget
router.put('/widget/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { data, position = { x: 0, y: 0 }, size = { width: 200, height: 200 } } = req.body;
  const userId = req.user.id;

  try {
    console.log("Updating widget with data:", { id, data, position, size, userId });
    const result = await session.run(
      'MATCH (w:Widget {id: $id, userId: $userId}) SET w.data = $data, w.position = $position, w.size = $size RETURN w',
      { id, data: JSON.stringify(data), position: JSON.stringify(position), size: JSON.stringify(size), userId }
    );
    const widget = result.records[0].get('w').properties;
    res.status(200).json(widget);
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all widgets for a specific page
router.get('/page/:pageId/widgets', authenticateJWT, async (req, res) => {
  const { pageId } = req.params;
  const userId = req.user.id;

  try {
    console.log(`Fetching widgets for page: ${pageId}`);
    const result = await session.run(
      'MATCH (w:Widget)-[:BELONGS_TO]->(p:Page {id: $pageId, userId: $userId}) RETURN w',
      { pageId, userId }
    );
    const widgets = result.records.map(record => {
      const widget = record.get('w').properties;
      widget.data = JSON.parse(widget.data);
      widget.position = JSON.parse(widget.position);
      widget.size = JSON.parse(widget.size);
      return widget;
    });
    console.log("Fetched widgets: ", widgets);
    res.status(200).json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a widget by its ID
router.delete('/widget/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await session.run(
      'MATCH (w:Widget {id: $id, userId: $userId}) DETACH DELETE w',
      { id, userId }
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete all widgets for a specific page
router.delete('/widgets', authenticateJWT, async (req, res) => {
  const { pageId } = req.query;
  const userId = req.user.id;

  try {
    await session.run(
      'MATCH (w:Widget)-[:BELONGS_TO]->(p:Page {id: $pageId, userId: $userId}) DETACH DELETE w',
      { pageId, userId }
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting widgets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
