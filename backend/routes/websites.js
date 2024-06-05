const express = require('express');
const router = express.Router();
const { session } = require('../db/neo4j');

// Route to create a new website
router.post('/website', async (req, res) => {
  const { id, name } = req.body;
  try {
    const result = await session.run(
      'CREATE (w:Website {id: $id, name: $name}) RETURN w',
      { id, name }
    );
    const website = result.records[0].get('w').properties;
    res.status(201).json(website);
  } catch (error) {
    console.error('Error creating website:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all websites
router.get('/websites', async (req, res) => {
  try {
    const result = await session.run('MATCH (w:Website) RETURN w');
    const websites = result.records.map(record => record.get('w').properties);
    res.status(200).json(websites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to create a new page within a website
router.post('/website/:websiteId/page', async (req, res) => {
  const { websiteId } = req.params;
  const { id, name } = req.body;
  try {
    const result = await session.run(
      'MATCH (w:Website {id: $websiteId}) CREATE (p:Page {id: $id, name: $name})-[:BELONGS_TO]->(w) RETURN p',
      { websiteId, id, name }
    );
    const page = result.records[0].get('p').properties;
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all pages within a website
router.get('/website/:websiteId/pages', async (req, res) => {
  const { websiteId } = req.params;
  try {
    const result = await session.run(
      'MATCH (p:Page)-[:BELONGS_TO]->(w:Website {id: $websiteId}) RETURN p',
      { websiteId }
    );
    const pages = result.records.map(record => record.get('p').properties);
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to create a new widget within a page
router.post('/page/:pageId/widget', async (req, res) => {
  const { pageId } = req.params;
  const { id, type, data } = req.body;
  try {
    const result = await session.run(
      'MATCH (p:Page {id: $pageId}) CREATE (w:Widget {id: $id, type: $type, data: $data})-[:BELONGS_TO]->(p) RETURN w',
      { pageId, id, type, data: JSON.stringify(data) }
    );
    const widget = result.records[0].get('w').properties;
    res.status(201).json(widget);
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all widgets within a page
router.get('/page/:pageId/widgets', async (req, res) => {
  const { pageId } = req.params;
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

module.exports = router;
