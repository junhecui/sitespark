const express = require('express');
const fs = require('fs');
const path = require('path');
const { session } = require('../db/neo4j');
const { s3, bucketName } = require('../db/s3');
const generateHTML = require('../generateHTML');

const router = express.Router();

router.post('/compile', async (req, res) => {
  const { websiteId, homePageId } = req.body;

  try {
    console.log('Compiling website with ID:', websiteId);
    console.log('Home Page ID:', homePageId);

    const result = await session.run(`
      MATCH (w:Website {id: $websiteId})<-[:BELONGS_TO]-(p:Page)
      OPTIONAL MATCH (p)<-[:BELONGS_TO]-(widget:Widget)
      RETURN w, p, collect(widget) AS widgets
    `, { websiteId });

    console.log('Database Query Result:', JSON.stringify(result, null, 2));

    if (result.records.length === 0) {
      console.error('No records found for the given website ID');
      return res.status(404).json({ message: 'No data found for the given website ID' });
    }

    const websiteData = result.records.map(record => {
      const page = record.get('p').properties;
      const widgets = record.get('widgets').map(widgetRecord => {
        const widget = widgetRecord.properties;
        console.log('Widget Data (raw):', widget);
        try {
          widget.data = JSON.parse(widget.data.replace(/\\\"/g, '"').slice(1, -1));
          widget.position = JSON.parse(widget.position.replace(/\\\"/g, '"').slice(1, -1));
          widget.size = JSON.parse(widget.size.replace(/\\\"/g, '"').slice(1, -1));
        } catch (e) {
          console.error('Error parsing widget data:', e);
          widget.data = {};
          widget.position = { x: 0, y: 0 };
          widget.size = { width: 100, height: 100 };
        }
        console.log('Parsed Widget Data:', widget);
        return widget;
      });
      return { ...page, widgets };
    });

    console.log('Website Data:', JSON.stringify(websiteData, null, 2));

    // Generate HTML for each page
    const uploadPromises = websiteData.map(page => {
      const htmlContent = generateHTML(page);
      const fileName = `page_${page.id}.html`;
      const fileContent = Buffer.from(htmlContent, 'utf8');

      return s3.upload({
        Bucket: bucketName,
        Key: `${websiteId}/${fileName}`,
        Body: fileContent,
        ContentType: 'text/html'
      }).promise();
    });

    await Promise.all(uploadPromises);

    const homePagePath = `${websiteId}/page_${homePageId}.html`;
    await s3.copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${homePagePath}`,
      Key: `${websiteId}/index.html`
    }).promise();

    res.status(200).json({ message: 'Website compiled and uploaded successfully', websiteId });
  } catch (error) {
    console.error('Error compiling website:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;