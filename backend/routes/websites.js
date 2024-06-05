const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { session } = require('../db/neo4j');
const { authenticateJWT } = require('./auth');

// Route to create a new website
router.post('/website', authenticateJWT, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const result = await session.run(
      'CREATE (w:Website {id: $id, name: $name, userId: $userId}) RETURN w',
      { id: uuidv4(), name, userId }
    );
    const website = result.records[0].get('w').properties;
    res.status(201).json(website);
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all websites for a specific user
router.get('/websites', authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await session.run(
      'MATCH (w:Website {userId: $userId}) RETURN w',
      { userId }
    );
    const websites = result.records.map(record => record.get('w').properties);
    res.status(200).json(websites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to create a new page within a website
router.post('/website/:websiteId/page', authenticateJWT, async (req, res) => {
  const { websiteId } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const result = await session.run(
      'MATCH (w:Website {id: $websiteId, userId: $userId}) CREATE (p:Page {id: $id, name: $name, userId: $userId})-[:BELONGS_TO]->(w) RETURN p',
      { websiteId, id: uuidv4(), name, userId }
    );
    const page = result.records[0].get('p').properties;
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all pages within a website for a specific user
router.get('/website/:websiteId/pages', authenticateJWT, async (req, res) => {
  const { websiteId } = req.params;
  const userId = req.user.id;

  try {
    const result = await session.run(
      'MATCH (p:Page)-[:BELONGS_TO]->(w:Website {id: $websiteId, userId: $userId}) RETURN p',
      { websiteId, userId }
    );
    const pages = result.records.map(record => record.get('p').properties);
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to create a new widget within a page
router.post('/page/:pageId/widget', authenticateJWT, async (req, res) => {
  const { pageId } = req.params;
  const { type, data } = req.body;
  const userId = req.user.id;

  try {
    const result = await session.run(
      'MATCH (p:Page {id: $pageId, userId: $userId}) CREATE (w:Widget {id: $id, type: $type, data: $data, userId: $userId})-[:BELONGS_TO]->(p) RETURN w',
      { pageId, id: uuidv4(), type, data: JSON.stringify(data), userId }
    );
    const widget = result.records[0].get('w').properties;
    res.status(201).json(widget);
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all widgets within a page for a specific user
router.get('/page/:pageId/widgets', authenticateJWT, async (req, res) => {
  const { pageId } = req.params;
  const userId = req.user.id;

  try {
    const result = await session.run(
      'MATCH (w:Widget)-[:BELONGS_TO]->(p:Page {id: $pageId, userId: $userId}) RETURN w',
      { pageId, userId }
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

// Route to update a widget
router.put('/widget/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const userId = req.user.id;

  try {
    const result = await session.run(
      'MATCH (w:Widget {id: $id, userId: $userId}) SET w.data = $data RETURN w',
      { id, data: JSON.stringify(data), userId }
    );
    const widget = result.records[0].get('w').properties;
    res.status(200).json(widget);
  } catch (error) {
    console.error('Error updating widget:', error);
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
