const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { session } = require('../db/neo4j');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Route to handle user registration
router.post('/signup', [
  body('username').not().isEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const userExists = await session.run(
      'MATCH (u:User {username: $username}) RETURN u',
      { username }
    );

    if (userExists.records.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await session.run(
      'CREATE (u:User {id: $id, username: $username, password: $password}) RETURN u',
      { id: uuidv4(), username, password: hashedPassword }
    );
    const user = result.records[0].get('u').properties;
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to handle user login
router.post('/login', [
  body('username').not().isEmpty(),
  body('password').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    const result = await session.run(
      'MATCH (u:User {username: $username}) RETURN u',
      { username }
    );

    if (result.records.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.records[0].get('u').properties;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1000h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to authenticate using JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { router, authenticateJWT };