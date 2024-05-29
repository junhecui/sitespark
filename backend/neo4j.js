const neo4j = require('neo4j-driver');

const uri = 'bolt://localhost:7687'; // Use the Bolt port for Neo4j
const user = 'neo4j';
const password = 'Watermelon1!';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

module.exports = driver;
