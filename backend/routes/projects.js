const express = require('express');
const router = express.Router();
const driver = require('../neo4j');

router.post('/save', async (req, res) => {
  const { pages } = req.body;

  const session = driver.session();

  try {
    // Clear previous data
    await session.run('MATCH (n) DETACH DELETE n');

    // Save new data
    for (let page of pages) {
      const pageResult = await session.run(
        'CREATE (p:Page {name: $name}) RETURN p',
        { name: page.name }
      );
      const pageNode = pageResult.records[0].get('p');

      for (let component of page.components) {
        await session.run(
          'CREATE (c:Component {type: $type, properties: $properties})-[:BELONGS_TO]->(p)',
          { type: component.type, properties: JSON.stringify(component.properties) }
        );
      }
    }

    res.status(200).json({ message: 'Project saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

router.get('/load', async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run('MATCH (p:Page)-[:BELONGS_TO]->(c:Component) RETURN p, c');
    const pages = [];

    result.records.forEach((record) => {
      const page = record.get('p').properties;
      const component = record.get('c').properties;
      component.properties = JSON.parse(component.properties);

      let pageExists = pages.find((p) => p.name === page.name);
      if (!pageExists) {
        pageExists = { name: page.name, components: [] };
        pages.push(pageExists);
      }
      pageExists.components.push(component);
    });

    res.status(200).json({ pages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

module.exports = router;
