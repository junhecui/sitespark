const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { driver } = require('../db/neo4j');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3Image, imageBucketName, PutObjectCommand } = require('../db/s3Image');
const { authenticateJWT } = require('./auth');

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

// Route to handle image uploads
router.post('/upload', upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileName = `${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: imageBucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3Image.send(command);
    const imageUrl = `https://${imageBucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to create a new widget within a page
router.post('/page/:pageId/widget', authenticateJWT, async (req, res) => {
  const { pageId } = req.params;
  const { type, data, position = { x: 0, y: 0 }, size = { width: 200, height: 200 } } = req.body;
  const userId = req.user.id;

  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (p:Page {id: $pageId, userId: $userId}) CREATE (w:Widget {id: $id, type: $type, data: $data, position: $position, size: $size, userId: $userId})-[:BELONGS_TO]->(p) RETURN w',
      { pageId, id: uuidv4(), type, data: JSON.stringify(data), position: JSON.stringify(position), size: JSON.stringify(size), userId }
    );
    const widget = result.records[0].get('w').properties;
    res.status(201).json(widget);
  } catch (error) {
    console.error('Error creating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await session.close();
  }
});

// Route to update a widget
router.put('/widget/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { data, position = { x: 0, y: 0 }, size = { width: 200, height: 200 } } = req.body;
  const userId = req.user.id;

  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (w:Widget {id: $id, userId: $userId}) SET w.data = $data, w.position = $position, w.size = $size RETURN w',
      { id, data: JSON.stringify(data), position: JSON.stringify(position), size: JSON.stringify(size), userId }
    );
    const widget = result.records[0].get('w').properties;
    res.status(200).json(widget);
  } catch (error) {
    console.error('Error updating widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await session.close();
  }
});

// Route to get all widgets for a specific page
router.get('/page/:pageId/widgets', authenticateJWT, async (req, res) => {
  const { pageId } = req.params;
  const userId = req.user.id;

  const session = driver.session();
  try {
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
    res.status(200).json(widgets);
  } catch (error) {
    console.error('Error fetching widgets:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await session.close();
  }
});

// Route to delete a widget by its ID
router.delete('/widget/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const session = driver.session();
  try {
    await session.run(
      'MATCH (w:Widget {id: $id, userId: $userId}) DETACH DELETE w',
      { id, userId }
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await session.close();
  }
});

// Route to delete all widgets for a specific page
router.delete('/widgets', authenticateJWT, async (req, res) => {
  const { pageId } = req.query;
  const userId = req.user.id;

  const session = driver.session();
  try {
    await session.run(
      'MATCH (w:Widget)-[:BELONGS_TO]->(p:Page {id: $pageId, userId: $userId}) DETACH DELETE w',
      { pageId, userId }
    );
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting widgets:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await session.close();
  }
});

module.exports = router;