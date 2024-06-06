const express = require('express');
const router = express.Router();
const { session } = require('../db/neo4j');

// Route to create a new page
router.post('/pages', async (req, res) => {
  const { name } = req.body;
  const id = `page_${Date.now()}`;

  try {
    const result = await session.run(
      'CREATE (p:Page {id: $id, name: $name}) RETURN p',
      { id, name }
    );
    const page = result.records[0].get('p').properties;
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all pages
router.get('/pages', async (req, res) => {
  try {
    const result = await session.run('MATCH (p:Page) RETURN p');
    const pages = result.records.map(record => record.get('p').properties);
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a page by its ID
router.delete('/pages/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await session.run('MATCH (p:Page {id: $id}) DETACH DELETE p', { id });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;