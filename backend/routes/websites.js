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

// Route to delete a page by its ID
router.delete('/pages/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await session.run(
      'MATCH (p:Page {id: $id, userId: $userId}) DETACH DELETE p',
      { id, userId }
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;